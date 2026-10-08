#!/usr/bin/env python3
"""Genere le CV d'Hector : resume.data.json + template.html -> cv-hector-en.html -> PDF (Chrome headless).

Usage (depuis n'importe ou) :
  python3 docs/resume/build.py            # brouillon : TO CONFIRM en rouge, PDF cv-hector-en-DRAFT.pdf
  python3 docs/resume/build.py --final    # version propre : champs TO CONFIRM retires, PDF cv-hector-en.pdf
  python3 docs/resume/build.py --no-pdf   # HTML seulement (pas de Chrome)

Aucune dependance hors bibliotheque standard, sauf PyMuPDF (fitz) pour verifier le nombre de pages.

Templating maison, volontairement minuscule :
  {{a.b}}            valeur echappee (HTML)      {{{a.b}}}  valeur brute
  {{.}}              element courant d'une liste
  {{x|num}}          16721 -> 16,721   {{x|joinc}} liste -> "a, b, c"   {{x|join}} liste -> "a · b · c"
  {{#x}}...{{/x}}    section : repete pour chaque element si liste, sinon affiche si vrai
  {{^x}}...{{/x}}    section inversee : affiche si faux / vide
  {{#x.length}}      vrai si la liste x n'est pas vide
"""
import argparse
import datetime
import html
import json
import os
import re
import signal
import subprocess
import sys
import tempfile
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = HERE / "resume.data.json"
TEMPLATE = HERE / "template.html"
CHROME = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
TODO = "TO CONFIRM"

# ---------------------------------------------------------------- donnees

def is_empty(v):
    if v is None:
        return True
    if isinstance(v, str):
        return v.strip() == ""
    if isinstance(v, (list, tuple)):
        return len(v) == 0
    if isinstance(v, dict):
        # un dict est vide si tout ce qui n'est pas technique (_x, kind) est vide
        return all(is_empty(x) for k, x in v.items() if not k.startswith("_") and k != "kind")
    return False


def clean_final(v):
    """Mode --final : retire tout ce qui est TO CONFIRM, dans cet ordre.
    1. valeur (ou puce) egale a, ou commencant par, TO CONFIRM : supprimee entierement (c'est une question)
    2. parenthese contenant TO CONFIRM : retiree ("French (TO CONFIRM level)" -> "French")
    3. clause apres "," ou ";" commencant par TO CONFIRM : coupee jusqu'a la fin de la phrase
    4. ce qui reste : ponctuation et espaces nettoyes ; les elements de liste vides disparaissent."""
    if isinstance(v, str):
        if v.strip() == TODO or v.lstrip().startswith(TODO):
            return ""
        s = re.sub(r"\s*\([^()]*" + re.escape(TODO) + r"[^()]*\)", "", v)
        s = re.sub(r"\s*[;,]\s*" + re.escape(TODO) + r"[^.;]*", "", s)
        s = s.replace(TODO, "")
        s = re.sub(r"\s{2,}", " ", s)
        s = re.sub(r"\s+([,;:.])", r"\1", s)
        s = re.sub(r"[,;:]\s*([.;,]|$)", r"\1", s)
        s = s.strip(" ,;:")
        if s and v.rstrip().endswith(".") and not s.endswith("."):
            s += "."
        return s
    if isinstance(v, list):
        out = [clean_final(x) for x in v]
        return [x for x in out if not is_empty(x)]
    if isinstance(v, dict):
        return {k: clean_final(x) for k, x in v.items()}
    return v


# ---------------------------------------------------------------- templating

SECTION = re.compile(r"{{([#^])\s*([\w.]+)\s*}}(.*?){{/\s*\2\s*}}", re.S)
VAR = re.compile(r"{{({?)\s*([\w.]+|\.)\s*(?:\|\s*(\w+))?\s*}?}}")


def lookup(path, stack):
    if path == ".":
        return stack[-1]
    parts = path.split(".")
    for ctx in reversed(stack):
        cur = ctx
        ok = True
        for p in parts:
            if p == "length" and isinstance(cur, (list, tuple, str)):
                cur = len(cur)
            elif isinstance(cur, dict) and p in cur:
                cur = cur[p]
            else:
                ok = False
                break
        if ok:
            return cur
    return None


def truthy(v):
    if isinstance(v, (list, tuple, dict, str)):
        return len(v) > 0
    return bool(v)


def apply_filter(v, flt):
    if flt == "num" and isinstance(v, (int, float)):
        return f"{v:,}"
    if flt == "joinc" and isinstance(v, (list, tuple)):
        return ", ".join(str(x) for x in v)
    if flt == "join" and isinstance(v, (list, tuple)):
        return " · ".join(str(x) for x in v)
    return v


def render(tpl, stack, draft):
    def mark(s):
        # en brouillon, chaque TO CONFIRM ressort en rouge
        return s.replace(TODO, f'<span class="todo">{TODO}</span>') if draft else s

    def sub_section(m):
        kind, path, body = m.group(1), m.group(2), m.group(3)
        v = lookup(path, stack)
        if kind == "^":
            return render(body, stack, draft) if not truthy(v) else ""
        if isinstance(v, (list, tuple)):
            return "".join(render(body, stack + [item], draft) for item in v)
        return render(body, stack + [v] if isinstance(v, dict) else stack, draft) if truthy(v) else ""

    def sub_var(m):
        raw, path, flt = m.group(1) == "{", m.group(2), m.group(3)
        v = lookup(path, stack)
        if v is None:
            return ""
        v = apply_filter(v, flt) if flt else v
        s = str(v) if not isinstance(v, (list, dict)) else json.dumps(v, ensure_ascii=False)
        return s if raw else mark(html.escape(s, quote=True))

    out = SECTION.sub(sub_section, tpl)
    return VAR.sub(sub_var, out)


# ---------------------------------------------------------------- pdf

def make_pdf(html_path: Path, pdf_path: Path) -> bool:
    """Imprime le HTML en PDF avec Chrome headless.
    Chrome ecrit le PDF en une seconde puis, selon l'environnement (updater Google, sandbox),
    ne quitte pas toujours : on surveille son journal et on le termine proprement nous-memes."""
    if not CHROME.exists():
        print(f"ERREUR : Chrome introuvable a {CHROME}. PDF non genere (le HTML est pret).")
        return False
    chrome_root = HERE / ".chrome"
    chrome_root.mkdir(exist_ok=True)
    ok = False
    with tempfile.TemporaryDirectory(dir=chrome_root, prefix="profile-") as profile:
        log_path = Path(profile) / "chrome.log"
        cmd = [
            str(CHROME),
            "--headless=new",
            "--disable-gpu",
            "--no-first-run",
            "--no-default-browser-check",
            "--disable-background-networking",
            "--disable-component-update",
            "--disable-sync",
            "--disable-extensions",
            "--hide-scrollbars",
            f"--user-data-dir={profile}",
            "--no-pdf-header-footer",
            "--virtual-time-budget=4000",
            f"--print-to-pdf={pdf_path}",
            html_path.as_uri(),
        ]
        with open(log_path, "w") as log:
            proc = subprocess.Popen(cmd, stdout=log, stderr=subprocess.STDOUT,
                                    stdin=subprocess.DEVNULL, start_new_session=True)
            deadline = time.time() + 60
            written = False
            while time.time() < deadline:
                try:
                    proc.wait(timeout=0.5)
                    break                      # Chrome a quitte tout seul
                except subprocess.TimeoutExpired:
                    pass
                if pdf_path.exists() and "written to file" in log_path.read_text(errors="replace"):
                    written = True
                    try:
                        proc.wait(timeout=3)   # on lui laisse 3 s pour quitter proprement
                    except subprocess.TimeoutExpired:
                        pass
                    break
            if proc.poll() is None:
                os.killpg(proc.pid, signal.SIGTERM)
                try:
                    proc.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    os.killpg(proc.pid, signal.SIGKILL)
                    proc.wait(timeout=5)
        tail = log_path.read_text(errors="replace").strip().splitlines()[-8:] if log_path.exists() else []
        ok = pdf_path.exists() and pdf_path.stat().st_size > 0
        if not ok:
            why = "a depasse 60 s" if not written and proc.returncode in (None, -15, -9) else f"code {proc.returncode}"
            print(f"ERREUR : Chrome headless a echoue ({why}), aucun PDF ecrit. Fin du journal :")
            for line in tail:
                print("   ", line)
    try:
        chrome_root.rmdir()                    # .chrome/ est ignore par git, on le laisse vide
    except OSError:
        pass
    return ok


def check_pages(pdf_path: Path) -> int:
    try:
        import fitz  # PyMuPDF
    except ImportError:
        print("AVERTISSEMENT : PyMuPDF (fitz) absent, nombre de pages non verifie.")
        return -1
    with fitz.open(pdf_path) as doc:
        n = doc.page_count
    return n


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--final", action="store_true", help="retire les champs TO CONFIRM au lieu de les afficher en rouge")
    ap.add_argument("--no-pdf", action="store_true", help="ne produit que le HTML")
    ap.add_argument("--data", type=Path, default=DATA)
    ap.add_argument("--template", type=Path, default=TEMPLATE)
    args = ap.parse_args()

    draft = not args.final
    data = json.loads(args.data.read_text(encoding="utf-8"))
    todo_count = len(re.findall(re.escape(TODO), json.dumps(data, ensure_ascii=False)))
    if not draft:
        data = clean_final(data)
    data["draft"] = draft
    data["final"] = not draft
    data["generated"] = datetime.date.today().isoformat()

    out_html = HERE / "cv-hector-en.html"
    out_pdf = HERE / ("cv-hector-en-DRAFT.pdf" if draft else "cv-hector-en.pdf")

    tpl = args.template.read_text(encoding="utf-8")
    page = render(tpl, [data], draft)
    out_html.write_text(page, encoding="utf-8")
    mode = "brouillon" if draft else "final"
    print(f"HTML ecrit : {out_html}  ({mode}, {todo_count} champs TO CONFIRM dans les donnees)")

    if args.no_pdf:
        return 0

    if out_pdf.exists():
        out_pdf.unlink()
    if not make_pdf(out_html, out_pdf):
        return 1
    n = check_pages(out_pdf)
    size_kb = out_pdf.stat().st_size // 1024
    print(f"PDF ecrit  : {out_pdf}  ({size_kb} Ko, {n} page{'s' if n != 1 else ''})")
    if n != 1:
        print(f"AVERTISSEMENT : le CV fait {n} pages au lieu de 1. Raccourcir les puces ou les pitchs dans resume.data.json.")
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
