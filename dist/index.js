const u = /^((\/?)(?:[^\/]*\/)*)((\.{1,2}|[^\/]+?|)(\.[^.\/]*|))[\/]*$/;
function a(v) {
  var t, d, s;
  const i = (t = u.exec(v)) === null || t === void 0 ? void 0 : t.slice(1);
  if (console.log("RENDER", +v), !i || i.length !== 5)
    return;
  const r = [], l = {
    root: i[1],
    dir: (d = i[0]) === null || d === void 0 ? void 0 : d.slice(0, -1),
    base: i[2],
    ext: i[4],
    name: i[3],
    modifiers: r
  };
  let o = (s = l.name) === null || s === void 0 ? void 0 : s.lastIndexOf(".");
  if (o && o > 0) {
    let e = l.name, n = e == null ? void 0 : e.substring(o);
    for (; n && n.length > 0; )
      r.push(n), e = e == null ? void 0 : e.substring(0, e.length - n.length), o = e == null ? void 0 : e.lastIndexOf("."), n = o && o > 0 ? e == null ? void 0 : e.substring(o) : void 0;
    l.name = e;
  }
  return l;
}
export {
  a as detectFileSysStyleRoute
};
