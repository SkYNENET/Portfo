"""Collecte les donnees PUBLIQUES du compte Roblox du proprietaire du portfolio.
Memes endpoints que api/roblox.ts, plus ceux qui listent ce qu'il a cree.
Sortie : docs/data/roblox.json (brut) et un resume lisible sur stdout."""
import json, sys, time, urllib.request, urllib.error

UID = int(sys.argv[1]) if len(sys.argv) > 1 else 7893763634
OUT = sys.argv[2] if len(sys.argv) > 2 else "docs/data/roblox.json"

def get(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"accept": "application/json", "user-agent": "portfolio-fetch/1.0"})
            with urllib.request.urlopen(req, timeout=15) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429 and i < tries - 1:
                time.sleep(2.5 * (i + 1)); continue
            return {"_error": f"HTTP {e.code}", "_url": url}
        except Exception as e:
            if i < tries - 1: time.sleep(1.5); continue
            return {"_error": str(e), "_url": url}

def pages(url_base, key="data"):
    """pagination Roblox par cursor"""
    out, cursor = [], ""
    for _ in range(20):
        u = url_base + (f"&cursor={cursor}" if cursor else "")
        d = get(u)
        if not isinstance(d, dict) or "_error" in d: 
            out.append(d) if isinstance(d, dict) else None
            break
        out.extend(d.get(key, []))
        cursor = d.get("nextPageCursor") or ""
        if not cursor: break
        time.sleep(0.4)
    return out

R = {"userId": UID}
R["user"] = get(f"https://users.roblox.com/v1/users/{UID}")
R["counts"] = {
    "friends":   get(f"https://friends.roblox.com/v1/users/{UID}/friends/count"),
    "followers": get(f"https://friends.roblox.com/v1/users/{UID}/followers/count"),
    "following": get(f"https://friends.roblox.com/v1/users/{UID}/followings/count"),
}
R["avatar"] = get(f"https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds={UID}&size=420x420&format=Png&isCircular=false")
R["robloxBadges"] = get(f"https://accountinformation.roblox.com/v1/users/{UID}/roblox-badges")

# jeux publics possedes par l'utilisateur
R["userGames"] = pages(f"https://games.roblox.com/v2/users/{UID}/games?accessFilter=Public&limit=50&sortOrder=Asc")

# groupes et roles : on retient ceux ou il est proprietaire (rank 255) ou haut place
roles = get(f"https://groups.roblox.com/v1/users/{UID}/groups/roles")
R["groupRoles"] = roles
owned = []
for g in (roles.get("data", []) if isinstance(roles, dict) else []):
    grp, role = g.get("group", {}), g.get("role", {})
    if role.get("rank", 0) >= 200:   # 255 = owner ; >=200 = admin/dev en general
        owned.append({"id": grp.get("id"), "name": grp.get("name"), "members": grp.get("memberCount"), "role": role.get("name"), "rank": role.get("rank")})
R["groupsHighRank"] = owned

# jeux publics de chaque groupe ou il est haut place
R["groupGames"] = {}
for g in owned:
    time.sleep(0.4)
    R["groupGames"][str(g["id"])] = pages(f"https://games.roblox.com/v2/groups/{g['id']}/games?accessFilter=Public&limit=50&sortOrder=Asc")

# stats detaillees de tous les univers trouves
universes = []
for gm in R["userGames"]:
    if isinstance(gm, dict) and gm.get("id"): universes.append(gm["id"])
for lst in R["groupGames"].values():
    for gm in lst:
        if isinstance(gm, dict) and gm.get("id"): universes.append(gm["id"])
universes = list(dict.fromkeys(universes))
R["universeIds"] = universes
R["gameStats"], R["gameVotes"], R["gameIcons"], R["gameFavorites"] = [], [], [], {}
for i in range(0, len(universes), 50):
    chunk = ",".join(map(str, universes[i:i+50]))
    R["gameStats"].extend((get(f"https://games.roblox.com/v1/games?universeIds={chunk}") or {}).get("data", []))
    R["gameVotes"].extend((get(f"https://games.roblox.com/v1/games/votes?universeIds={chunk}") or {}).get("data", []))
    R["gameIcons"].extend((get(f"https://thumbnails.roblox.com/v1/games/icons?universeIds={chunk}&size=512x512&format=Png&returnPolicy=PlaceHolder") or {}).get("data", []))
    time.sleep(0.4)
for u in universes:
    R["gameFavorites"][str(u)] = get(f"https://games.roblox.com/v1/games/{u}/favorites/count")
    time.sleep(0.25)

# icones de groupes
if owned:
    ids = ",".join(str(g["id"]) for g in owned)
    R["groupIcons"] = get(f"https://thumbnails.roblox.com/v1/groups/icons?groupIds={ids}&size=150x150&format=Png")

json.dump(R, open(OUT, "w"), indent=1, ensure_ascii=False)

# ---- resume lisible ----
u = R["user"] if isinstance(R["user"], dict) else {}
print("=== COMPTE ===")
print(f"  {u.get('displayName')} (@{u.get('name')}) id {UID} | cree le {str(u.get('created',''))[:10]} | banni: {u.get('isBanned')}")
desc = (u.get("description") or "").strip().replace("\n", " / ")
print(f"  description: {desc[:300] or '(vide)'}")
c = R["counts"]
print(f"  amis {c['friends'].get('count','?')} | abonnes {c['followers'].get('count','?')} | abonnements {c['following'].get('count','?')}")
rb = R["robloxBadges"]
print(f"  badges Roblox: {', '.join(b.get('name','') for b in rb) if isinstance(rb, list) else rb}")

votes = {v["id"]: v for v in R["gameVotes"] if isinstance(v, dict)}
icons = {i["targetId"]: i.get("imageUrl") for i in R["gameIcons"] if isinstance(i, dict)}
print(f"\n=== JEUX PUBLICS ({len(R['gameStats'])}) ===")
for g in sorted(R["gameStats"], key=lambda x: -x.get("visits", 0)):
    v = votes.get(g["id"], {})
    fav = R["gameFavorites"].get(str(g["id"]), {}).get("favoritesCount", "?")
    cr = g.get("creator", {})
    print(f"  - {g['name']}  | universe {g['id']} | place {g.get('rootPlaceId')}")
    print(f"      visites {g.get('visits')} | en ligne {g.get('playing')} | favoris {fav} | +{v.get('upVotes','?')} / -{v.get('downVotes','?')} | max {g.get('maxPlayers')} joueurs")
    print(f"      createur: {cr.get('type')} {cr.get('name')} (id {cr.get('id')}) | cree {str(g.get('created',''))[:10]} | maj {str(g.get('updated',''))[:10]} | genre {g.get('genre')}")
    print(f"      icone: {icons.get(g['id'])}")
    d = (g.get("description") or "").strip().replace("\n", " / ")
    if d: print(f"      description: {d[:240]}")

print(f"\n=== GROUPES OU IL EST HAUT PLACE ({len(owned)}) ===")
for g in owned:
    print(f"  - {g['name']} | id {g['id']} | {g['members']} membres | role {g['role']} (rank {g['rank']}) | jeux publics du groupe: {len([x for x in R['groupGames'].get(str(g['id']), []) if isinstance(x, dict) and x.get('id')])}")
allg = roles.get("data", []) if isinstance(roles, dict) else []
print(f"\n=== TOUS SES GROUPES ({len(allg)}) ===")
for g in allg:
    print(f"  - {g['group']['name']} (id {g['group']['id']}, {g['group'].get('memberCount')} membres) : {g['role']['name']} rank {g['role']['rank']}")
