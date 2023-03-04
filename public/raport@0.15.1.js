(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Raport = {}));
}(this, (function (exports) { 'use strict';

    const Fail = [];
    let detailedFail = 0;
    const _cause = [0, ''];
    const _latestCause = [0, ''];
    function getCause() { return _cause; }
    function getCauseCopy(name) {
        suggestCauseName(name ? name.name || name : undefined);
        return _cause.slice();
    }
    function resetLatestCause() {
        _latestCause[0] = 0;
        _latestCause[1] = '';
        _latestCause[2] = undefined;
        _latestCause[3] = undefined;
        _latestCause[4] = undefined;
    }
    function suggestCauseName(name) {
        if (!_cause[2] && name) {
            if (_cause[0] === _latestCause[0] && _cause[2] === _latestCause[2])
                _latestCause[2] = name;
            _cause[2] = name;
        }
    }
    function overrideCauseName(name) {
        if (name) {
            if (_cause[0] === _latestCause[0] && _cause[2] === _latestCause[2])
                _latestCause[2] = name;
            _cause[2] = name;
        }
    }
    function fail(pos, message, name, cause, causes) {
        _cause[0] = pos;
        _cause[1] = message || '';
        _cause[2] = name;
        _cause[3] = cause;
        _cause[4] = causes;
        if (detailedFail & 1 && _cause[0] >= _latestCause[0]) {
            _latestCause[0] = _cause[0];
            _latestCause[1] = _cause[1];
            _latestCause[2] = _cause[2];
            _latestCause[3] = _cause[3];
            _latestCause[4] = _cause[4];
        }
        return Fail;
    }
    function addCause(cause) {
        (_cause[4] || (_cause[4] = [])).push(cause);
    }
    function isNodeName(v) {
        return typeof v === 'string' || (v && 'name' in v && typeof v.name === 'string');
    }
    function openNode(start, name) {
        return { start, end: start, children: [], name };
    }
    function closeNode(node, parent, res) {
        node.end = res[1];
        if (_compact && node.end === node.start)
            return;
        node.result = res[0];
        if (!parent) {
            node.children.reduce((last, c, i) => {
                if (last < c.start)
                    (node.extra || (node.extra = {}))[i] = [last, c.start];
                return c.end;
            }, node.start);
            const l = node.children[node.children.length - 1];
            if (l && node.end > l.end)
                (node.extra || (node.extra = {}))[node.children.length] = [l.end, node.end];
        }
        else if (_compact) {
            if (node.name && node.name.primary) {
                const c = node.children[0];
                if (node.children.length === 1 && c.start === node.start && c.end === node.end)
                    parent.children.push(c);
                else {
                    node.name = node.name.name;
                    node.children.reduce((last, c, i) => {
                        if (last < c.start)
                            (node.extra || (node.extra = {}))[i] = [last, c.start];
                        return c.end;
                    }, node.start);
                    const l = node.children[node.children.length - 1];
                    if (l && node.end > l.end)
                        (node.extra || (node.extra = {}))[node.children.length] = [l.end, node.end];
                    parent.children.push(node);
                }
            }
            else if (node.children.length) {
                parent.children.push.apply(parent.children, node.children);
            }
        }
        else
            parent.children.push(node);
    }
    function getLineNum(input, pos) {
        let n = 1;
        while (~(pos = input.lastIndexOf('\n', pos))) {
            if (!pos)
                break;
            n++;
            pos--;
        }
        return n;
    }
    function getParseError(cause, input, context) {
        const lines = [];
        const pos = cause[0];
        let n = pos;
        let first = n = input.lastIndexOf('\n', n);
        let t = input.lastIndexOf('\n', n - 1);
        for (let i = 0; i < context && ~n; i++) {
            lines.unshift(input.substring(t + 1, n));
            n = t;
            t = input.lastIndexOf('\n', n - 1);
        }
        const markerOffset = lines.length + 1;
        t = first;
        n = input.indexOf('\n', t + 1);
        if (n === -1 && t < input.length)
            n = input.length;
        for (let i = 0; i <= context && ~n; i++) {
            lines.push(input.substring(t + 1, n));
            t = n;
            n = input.indexOf('\n', t + 1);
            if (n === -1 && t < input.length)
                n = input.length;
        }
        const source = lines[markerOffset - 1];
        let marker = '';
        const len = pos - (!~first ? -1 : first) - 1;
        for (let i = 0; i < len; i++)
            marker += source[i] === '\t' ? '\t' : ' ';
        marker += '^--';
        return {
            context: lines,
            column: pos - first,
            line: getLineNum(input, pos),
            position: pos,
            source,
            message: cause[1],
            marked: `${lines.slice(0, markerOffset).join('\n')}\n${marker}\n${lines.slice(markerOffset).join('\n')}`,
            cause: cause[3] && getParseError(cause[3], input, context),
            causes: cause[4] && cause[4].map(c => getParseError(c, input, context)),
            parser: cause[2] ? cause[2].name || cause[2] : undefined,
        };
    }
    function findLatestCause(cause) {
        let res = cause;
        if (cause[3]) {
            const c = findLatestCause(cause[3]);
            if (c[0] > res[0])
                res = c;
        }
        if (cause[4]) {
            const len = cause[4].length;
            for (let i = 0; i < len; i++) {
                const c = findLatestCause(cause[4][i]);
                if (c[0] > res[0])
                    res = c;
            }
        }
        if (_latestCause[0] >= _cause[0] && _latestCause[1] !== cause[1])
            return _latestCause;
        return res;
    }
    const startSpace = /^\s*/;
    const shared = {};
    let _compact = false;
    function parser(parser, error) {
        let mps;
        const oerror = error;
        const det = (error ? (error.detailed ? 1 : 0) + (error.causes ? 2 : 0) : 0);
        const consume = error && error.consumeAll;
        const res = function parse(input, error) {
            const trim = error && 'trim' in error ? error.trim : oerror && oerror.trim;
            const start = trim ? startSpace.exec(input)[0].length : 0;
            if (trim)
                parser = shared.map(shared.seq(parser, shared.skip(' \t\r\n')), ([a]) => a);
            const d = (error ? (error.detailed ? 1 : 0) + (error.causes ? 2 : 0) : det);
            let res = [null, 0];
            if (d & 1)
                resetLatestCause();
            const node = (error && 'tree' in error && error.tree) && openNode(0);
            _compact = node && (error && 'compact' in error ? error.compact : oerror && 'compact' in oerror ? oerror.compact : false) === true;
            if (d !== detailedFail) {
                const c = detailedFail;
                detailedFail = d;
                res = (mps || (mps = unwrap(parser))).parse(input, start, res, node);
                detailedFail = c;
            }
            else {
                res = (mps || (mps = unwrap(parser))).parse(input, start, res, node);
            }
            if (res.length && (error && 'consumeAll' in error ? error.consumeAll : consume) && res[1] < input.length) {
                res = fail(res[1], d & 1 && `expected to consume all input, but only ${res[1]} chars consumed`);
            }
            if (!res.length) {
                if (error && 'undefinedOnError' in error ? error.undefinedOnError : oerror && oerror.undefinedOnError)
                    return;
                const cause = getCause();
                const ctx = (error && 'contextLines' in error ? error.contextLines : oerror && oerror.contextLines) || 0;
                const err = getParseError(getLatestCause(cause[4] || [], cause), input, ctx);
                const latest = findLatestCause(cause);
                if (cause !== latest)
                    err.latest = getParseError(latest, input, ctx);
                if (error && 'throw' in error ? error.throw : oerror && oerror.throw) {
                    const ex = new Error(err.message);
                    throw Object.assign(ex, err);
                }
                else
                    return err;
            }
            else {
                if (node) {
                    closeNode(node, null, res);
                    if (!_compact && trim) {
                        const n = node.children[0].children[0];
                        n.result = res[0];
                        return n;
                    }
                    return node;
                }
                return res[0];
            }
        };
        res.parser = parser;
        return res;
    }
    const uninit = { parse: (_s, p) => fail(p, detailedFail & 1 && 'uninitialized lazy parser') };
    function unwrap(parser) {
        return (parser.parser || parser) || uninit;
    }
    function lazy(init, parse) {
        let res;
        res = {
            parse(s, p, r, tree) {
                init();
                res.parse = parse;
                return parse(s, p, r, tree);
            }
        };
        return res;
    }
    function concat$1(strings) {
        let res = '';
        const len = strings.length;
        for (let i = 0; i < len; i++) {
            if (strings[i])
                res = res.concat(strings[i]);
        }
        return res;
    }
    function getLatestCause(causes, outer) {
        if (!causes || !outer)
            return _latestCause;
        let max = outer[0];
        outer[4] = causes;
        let f;
        const cs = causes || [];
        for (let i = 0; i < cs.length; i++) {
            if (cs[i][0] > max) {
                f = cs[i];
                max = f[0];
            }
        }
        if (f)
            return [f[0], f[1], f[2], outer];
        else
            return outer;
    }

    function contains0() {
        return false;
    }
    function contains1(str, x) {
        return str === x;
    }
    function contains2(str, x) {
        return str[0] === x || str[1] === x;
    }
    function contains3(str, x) {
        return str[0] === x || str[1] === x || str[2] === x;
    }
    function contains4(str, x) {
        return str[0] === x || str[1] === x || str[2] === x || str[3] === x;
    }
    function contains5(str, x) {
        return str[0] === x || str[1] === x || str[2] === x || str[3] === x || str[4] === x;
    }
    function contains6(str, x) {
        return str[0] === x || str[1] === x || str[2] === x || str[3] === x || str[4] === x || str[5] === x;
    }
    function contains7(str, x) {
        return str[0] === x || str[1] === x || str[2] === x || str[3] === x || str[4] === x || str[5] === x || str[6] === x;
    }
    function contains8(str, x) {
        return str[0] === x || str[1] === x || str[2] === x || str[3] === x || str[4] === x || str[5] === x || str[6] === x || str[7] === x;
    }
    function contains9(str, x) {
        return str[0] === x || str[1] === x || str[2] === x || str[3] === x || str[4] === x || str[5] === x || str[6] === x || str[7] === x || str[8] === x;
    }
    function contains10(str, x) {
        return str[0] === x || str[1] === x || str[2] === x || str[3] === x || str[4] === x || str[5] === x || str[6] === x || str[7] === x || str[8] === x || str[9] === x;
    }
    function containsFor(str, x) {
        const len = str.length;
        for (let i = 0; i < len; i++)
            if (str[i] === x)
                return true;
        return false;
    }
    function containsBinary(str, x) {
        let end = str.length - 1;
        let start = 0;
        if (x < str[0] || x > str[end])
            return false;
        let mid;
        let c;
        while (start <= end) {
            mid = (start + end) >> 1;
            c = str[mid];
            if (c === x)
                return true;
            else if (c < x)
                start = mid + 1;
            else
                end = mid - 1;
        }
    }
    function getSearch(str, sorted = true) {
        const len = str.length;
        if (len === 0)
            return contains0;
        if (len === 1)
            return contains1;
        if (len === 2)
            return contains2;
        if (len === 3)
            return contains3;
        if (len === 4)
            return contains4;
        if (len === 5)
            return contains5;
        if (len === 6)
            return contains6;
        if (len === 7)
            return contains7;
        if (len === 8)
            return contains8;
        if (len === 9)
            return contains9;
        if (len === 10)
            return contains10;
        if (sorted)
            return containsBinary;
        else
            return containsFor;
    }

    function charList(chars) {
        let res = '';
        const sorted = chars.split('').sort().join('');
        for (let i = 0; i < sorted.length; i++) {
            if (!~res.indexOf(sorted[i]))
                res += sorted[i];
        }
        return res;
    }
    function seekUntilChar(s, p, chars, contains) {
        const len = s.length;
        for (let i = p; i < len; i++) {
            if (contains(chars, s[i]))
                return i;
        }
        return len;
    }
    function seekWhileChar(s, p, chars, contains) {
        const len = s.length;
        for (let i = p; i < len; i++) {
            if (!contains(chars, s[i]))
                return i;
        }
        return len;
    }
    function skip(chars) {
        const sorted = charList(chars);
        const contains = getSearch(sorted);
        return {
            parse(s, p, res) {
                res[1] = seekWhileChar(s, p, sorted, contains);
                return res;
            }
        };
    }
    shared.skip = skip;
    function skip1(chars, name) {
        const sorted = charList(chars);
        const contains = getSearch(sorted);
        return {
            parse(s, p, res) {
                res[1] = seekWhileChar(s, p, sorted, contains);
                if (res[1] === p)
                    return fail(p, detailedFail & 1 && `expected at least one of ${JSON.stringify(chars)}`, name);
                return res;
            }
        };
    }
    function read(chars) {
        const sorted = charList(chars);
        const contains = getSearch(sorted);
        return {
            parse(s, p, res) {
                const r = seekWhileChar(s, p, sorted, contains);
                res[0] = s.substring(p, r);
                res[1] = r;
                return res;
            }
        };
    }
    function read1(chars, name) {
        const sorted = charList(chars);
        const contains = getSearch(sorted);
        return {
            parse(s, p, res) {
                const r = seekWhileChar(s, p, sorted, contains);
                if (r === p)
                    return fail(p, detailedFail & 1 && `expected one of ${JSON.stringify(chars)}`, name);
                res[0] = s.substring(p, r);
                res[1] = r;
                return res;
            }
        };
    }
    function chars(count, allowed, name) {
        const sorted = allowed && charList(allowed);
        const search = getSearch(sorted || '');
        return {
            parse(s, p, res) {
                if (s.length - p >= count) {
                    const str = s.substr(p, count);
                    if (sorted) {
                        for (let i = 0; i < count; i++)
                            if (!search(sorted, str[i]))
                                return fail(p + i, detailedFail & 1 && 'unexpected char', name);
                    }
                    res[0] = str;
                    res[1] = p + count;
                    return res;
                }
                else
                    return fail(p, detailedFail & 1 && 'unexpected end of input', name);
            }
        };
    }
    function notchars(count, disallowed, name) {
        const sorted = charList(disallowed);
        const search = getSearch(sorted);
        return {
            parse(s, p, res) {
                if (s.length - p >= count) {
                    const str = s.substr(p, count);
                    for (let i = 0; i < count; i++)
                        if (search(sorted, str[i]))
                            return fail(p + i, detailedFail & 1 && 'unexpected char', name);
                    res[0] = str;
                    res[1] = p + count;
                    return res;
                }
                else
                    return fail(p, detailedFail & 1 && 'unexpected end of input', name);
            }
        };
    }
    function readTo(stop, end, name) {
        const sorted = charList(stop);
        const contains = getSearch(sorted);
        return {
            parse(s, p, res) {
                const skipped = seekUntilChar(s, p, sorted, contains);
                if (!end && skipped >= s.length)
                    return fail(skipped - 1, detailedFail & 1 && `expected one of ${JSON.stringify(stop)} before end of input`, name);
                res[0] = skipped ? s.substring(p, skipped) : '';
                res[1] = skipped;
                return res;
            }
        };
    }
    function read1To(stop, end, name) {
        const op = readTo(stop, end);
        return {
            parse(s, p, resin) {
                const res = op.parse(s, p, resin);
                if (!res.length)
                    return res;
                else if (res[1] > p)
                    return res;
                else
                    return fail(p, detailedFail & 1 && `expected at least one character`, name);
            }
        };
    }

    function str(...strings) {
        const len = strings.length;
        if (len === 1) {
            const str = strings[0];
            const len = str.length;
            if (len === 1) {
                return {
                    parse(s, p, res) {
                        if (s[p] === str) {
                            res[0] = str;
                            res[1] = p + 1;
                            return res;
                        }
                        else
                            return fail(p, detailedFail & 1 && `expected ${str}`);
                    }
                };
            }
            else if (len === 2) {
                return {
                    parse(s, p, res) {
                        if (s[p] === str[0] && s[p + 1] === str[1]) {
                            res[0] = str;
                            res[1] = p + 2;
                            return res;
                        }
                        else
                            return fail(p, detailedFail & 1 && `expected ${str}`);
                    }
                };
            }
            else {
                let i, j;
                return {
                    parse(s, p, res) {
                        for (i = 0, j = p + i; i < len; i++, j++) {
                            if (str[i] !== s[j])
                                return fail(p, detailedFail & 1 && `expected ${str}`);
                        }
                        res[0] = str;
                        res[1] = p + len;
                        return res;
                    }
                };
            }
        }
        else {
            return {
                parse(s, p, res) {
                    outer: for (let i = 0; i < len; i++) {
                        const n = strings[i];
                        const nlen = n.length;
                        if (nlen === 1) {
                            if (s[p] === n)
                                return [n, p + nlen];
                            else
                                continue outer;
                        }
                        for (let j = 0; j < nlen; j++) {
                            if (n[j] !== s[p + j])
                                continue outer;
                        }
                        res[0] = n;
                        res[1] = p + nlen;
                        return res;
                    }
                    return fail(p, detailedFail & 1 && `expected ${strings.length > 1 ? 'one of ' : ''}${strings.map(s => `${s}`).join(', ')}`);
                }
            };
        }
    }
    function istr(...strings) {
        const copy = strings.slice();
        const chars = read1(copy.map(s => s.toLowerCase() + s.toUpperCase()).join(''));
        const idx = copy.map(s => s.toLowerCase());
        return {
            parse(s, p, res) {
                const r = chars.parse(s, p, res);
                if (!r.length)
                    return r;
                const i = idx.indexOf(r[0].toLowerCase());
                if (!~i)
                    return fail(p, detailedFail & 1 && `expected ${copy.length > 1 ? 'one of ' : ''}${copy.map(s => `${s}`).join(', ')}`);
                r[0] = copy[i];
                return r;
            }
        };
    }

    function opt(parser, name) {
        let ps;
        return lazy(() => ps = unwrap(parser), function parse(s, p, resin, tree) {
            const node = tree && openNode(p, name);
            const res = ps.parse(s, p, resin, node);
            if (res.length) {
                if (node)
                    closeNode(node, tree, res);
                return res;
            }
            else {
                resin[0] = null;
                resin[1] = p;
                return resin;
            }
        });
    }
    function not(parser, message) {
        let ps;
        return lazy(() => ps = unwrap(parser), function parse(s, p, resin) {
            const res = ps.parse(s, p, resin);
            if (res.length)
                return fail(p, detailedFail & 1 && (message || `unexpected ${s.slice(p, res[1])}`));
            else {
                resin[0] = '';
                resin[1] = p;
                return resin;
            }
        });
    }
    function alt(name, ...parsers) {
        const nm = isNodeName(name) ? name : undefined;
        const lps = isNodeName(name) ? parsers : (name ? [name] : []).concat(parsers);
        let ps;
        const len = lps.length;
        return lazy(() => ps = lps.map(unwrap), function parse(s, p, resin, tree) {
            let fails;
            const node = tree && openNode(p, nm);
            for (let i = 0; i < len; i++) {
                const res = ps[i].parse(s, p, resin, node);
                if (res.length) {
                    if (node)
                        closeNode(node, tree, res);
                    return res;
                }
                else if (detailedFail & 2)
                    (fails || (fails = [])).push(getCauseCopy(nm));
            }
            if (detailedFail & 2) {
                const cause = getLatestCause(fails, [p, `expected ${nm || 'alternate'}`, nm]);
                if (fails.length && fails.map(f => f[0]).reduce((a, c) => a + c, 0) === fails[0][0] * fails.length)
                    cause[2] = nm;
                return fail(cause[0], cause[1], cause[2] || nm, cause[3], cause[4]);
            }
            else {
                if (detailedFail & 1 && getLatestCause()[0] === p && nm)
                    overrideCauseName(nm && (nm.name || nm));
                return fail(p, detailedFail & 1 && `expected ${nm || 'alternate'}`, nm);
            }
        });
    }
    function verify(parser, verify, name) {
        let ps;
        return lazy(() => ps = unwrap(parser), function parse(s, p, res, tree) {
            const node = tree && openNode(p, name);
            const r = ps.parse(s, p, res, node);
            if (!r.length)
                return r;
            const v = verify(r[0]);
            if (v === true) {
                if (node)
                    closeNode(node, tree, r);
                return r;
            }
            else
                return fail(r[1], v, name);
        });
    }
    function map(parser, fn, name) {
        let ps;
        let err;
        const none = '';
        const error = (e) => err = e;
        return lazy(() => ps = unwrap(parser), function parse(s, p, res, tree) {
            const node = tree && openNode(p, name);
            const r = ps.parse(s, p, res, node);
            if (r.length) {
                const last = err;
                err = none;
                r[0] = fn(r[0], error, p, r[1]);
                const cur = err;
                err = last;
                if (cur)
                    return fail(r[1], cur, name);
                if (node)
                    closeNode(node, tree, r);
                return r;
            }
            else {
                suggestCauseName(name && (name.name || name));
                return r;
            }
        });
    }
    shared.map = map;
    function name(parser, name) {
        let ps;
        return lazy(() => ps = unwrap(parser), function parse(s, p, res, tree) {
            if (tree) {
                const node = openNode(p, name);
                const r = ps.parse(s, p, res, node);
                if (r.length) {
                    if (node.children.length) {
                        node.children[0].name = name;
                        tree.children.push(node.children[0]);
                    }
                    else {
                        closeNode(node, tree, r);
                    }
                }
                if (detailedFail & 1)
                    suggestCauseName(typeof name === 'string' ? name : name.name);
                return r;
            }
            else {
                const r = ps.parse(s, p, res);
                if (!r.length && detailedFail & 1)
                    suggestCauseName(typeof name === 'string' ? name : name.name);
                return r;
            }
        });
    }

    function rep(parser, name) {
        let ps;
        const empty = [];
        return lazy(() => ps = unwrap(parser), function parse(s, p, resin, tree) {
            const node = tree && openNode(p, name);
            let seq;
            let c = p;
            let res;
            res = ps.parse(s, c, resin, node);
            if (!res.length || res[1] === c) {
                resin[0] = empty;
                resin[1] = c;
                if (detailedFail & 2)
                    resin[2] = getCauseCopy(name);
                return resin;
            }
            else {
                c = res[1];
                seq = [res[0]];
            }
            while (1) {
                res = ps.parse(s, c, resin, node);
                if (res.length && res[1] !== c) {
                    seq.push(res[0]);
                    c = res[1];
                }
                else {
                    resin[0] = seq || [];
                    resin[1] = c;
                    detailedFail & 2 && (resin[2] = getCauseCopy(name));
                    if (node)
                        closeNode(node, tree, resin);
                    return resin;
                }
            }
        });
    }
    function rep1(parser, name) {
        let ps;
        return lazy(() => ps = unwrap(parser), function parse(s, p, resin, tree) {
            const node = tree && openNode(p, name);
            let seq;
            let c = p;
            let res;
            res = ps.parse(s, c, resin, node);
            if (res.length) {
                (seq = []).push(res[0]);
                c = res[1];
                while (1) {
                    res = ps.parse(s, c, resin, node);
                    if (res.length) {
                        seq.push(res[0]);
                        c = res[1];
                    }
                    else {
                        resin[0] = seq;
                        resin[1] = c;
                        if (detailedFail & 2)
                            resin[2] = getCauseCopy(name);
                        if (node)
                            closeNode(node, tree, resin);
                        return resin;
                    }
                }
            }
            else {
                return fail(c, detailedFail & 1 && `expected at least one ${name || 'item'}`, name, detailedFail & 2 && getCauseCopy(name));
            }
        });
    }
    function repsep(parser, sep, trail = 'disallow', name) {
        let ps1;
        let ps2;
        const empty = [];
        return lazy(() => (ps1 = unwrap(parser), ps2 = unwrap(sep)), function parse(s, p, resin, tree) {
            const node = tree && openNode(p, name);
            let seq;
            let c = p;
            let m = p;
            let rr;
            let res;
            let r;
            res = ps1.parse(s, c, resin, node);
            if (res.length && res[1] !== c) {
                rr = res[0];
                m = c;
                c = res[1];
                r = ps2.parse(s, c, resin);
                if (!r.length) {
                    if (trail === 'require')
                        return fail(m, detailedFail & 1 && `expected separator`, name);
                    resin[0] = [rr];
                    resin[1] = c;
                    if (node)
                        closeNode(node, tree, resin);
                    return resin;
                }
                else {
                    c = r[1];
                }
                seq = [rr];
            }
            else {
                resin[0] = empty;
                resin[1] = p;
                if (detailedFail & 2)
                    resin[2] = getCauseCopy(name);
                return resin;
            }
            while (1) {
                res = ps1.parse(s, c, resin, node);
                if (res.length && res[1] !== c) {
                    m = c;
                    c = res[1];
                    rr = res[0];
                    r = ps2.parse(s, c, resin);
                    if (!r.length) {
                        if (trail === 'require')
                            return fail(m, detailedFail & 1 && `expected separator`, name);
                        seq.push(rr);
                        break;
                    }
                    else
                        c = r[1];
                    seq.push(rr);
                }
                else if (trail === 'disallow' && seq && seq.length) {
                    if (detailedFail & 2) {
                        const cause = getCause();
                        return fail(cause[0], cause[1], name, [c, `unexpected separator`]);
                    }
                    else
                        return fail(c, detailedFail & 1 && `unexpected separator`, name);
                }
                else
                    break;
            }
            resin[0] = seq;
            resin[1] = c;
            detailedFail & 2 && (resin[2] = getCauseCopy(name));
            if (node)
                closeNode(node, tree, resin);
            return resin;
        });
    }
    function rep1sep(parser, sep, trail = 'disallow', name) {
        let ps1;
        let ps2;
        return lazy(() => (ps1 = unwrap(parser), ps2 = unwrap(sep)), function parse(s, p, resin, tree) {
            const node = tree && openNode(p, name);
            let seq;
            let c = p;
            let l = c;
            let res;
            res = ps1.parse(s, c, resin, node);
            if (res.length) {
                (seq = []).push(res[0]);
                l = c = res[1];
                const r = ps2.parse(s, c, resin);
                if (!r.length) {
                    if (trail === 'require')
                        return fail(c, detailedFail & 1 && `expected separator`, name);
                }
                else {
                    c = r[1];
                    while (1) {
                        res = ps1.parse(s, c, resin, node);
                        if (res.length) {
                            seq.push(res[0]);
                            l = c = res[1];
                            const r = ps2.parse(s, c, resin);
                            if (!r.length) {
                                if (trail === 'require')
                                    return fail(c, detailedFail & 1 && `expected separator`, name);
                                break;
                            }
                            else
                                c = r[1];
                        }
                        else if (trail === 'disallow' && seq && seq.length) {
                            resin[0] = seq;
                            resin[1] = l;
                            if (node)
                                closeNode(node, tree, resin);
                            return resin;
                        }
                        else
                            break;
                    }
                }
            }
            else
                return fail(c, detailedFail & 1 && `expected at least one ${name || 'item'}`);
            resin[0] = seq;
            resin[1] = c;
            if (detailedFail & 2)
                resin[2] = getCauseCopy(name);
            if (node)
                closeNode(node, tree, resin);
            return resin;
        });
    }

    function bracket(first, content, right, name) {
        const nm = isNodeName(right) ? right : isNodeName(name) ? name : undefined;
        if (Array.isArray(first)) {
            let ends;
            let ps;
            const len = first.length;
            return lazy(() => (ps = unwrap(content), ends = first.map(unwrap)), function parse(s, p, resin, tree) {
                const node = tree && openNode(p, nm);
                let cause;
                let end;
                for (let i = 0; i < len; i++) {
                    const res = ends[i].parse(s, p, resin);
                    if (res.length) {
                        end = ends[i];
                        break;
                    }
                }
                if (!end)
                    return fail(p, detailedFail & 1 && `expected opening bracket`, name);
                const res = ps.parse(s, resin[1], resin, node);
                if (!res.length)
                    return res;
                if (detailedFail & 2)
                    cause = res[2];
                const v = res[0];
                const c = res[1];
                const fin = end.parse(s, c, resin);
                if (!fin.length)
                    return fail(c, detailedFail & 1 && `expected matching end bracket`, name, detailedFail & 2 && cause);
                resin[0] = v;
                if (node)
                    closeNode(node, tree, resin);
                return resin;
            });
        }
        else if (!isNodeName(right)) {
            let ps1;
            let ps2;
            let ps3;
            return lazy(() => (ps1 = unwrap(first), ps2 = unwrap(content), ps3 = unwrap(right)), function parse(s, p, resin, tree) {
                let cause;
                const node = tree && openNode(p, nm);
                const r1 = ps1.parse(s, p, resin);
                if (!r1.length)
                    return r1;
                const r2 = ps2.parse(s, r1[1], resin, node);
                if (!r2.length)
                    return r2;
                if (detailedFail & 2 && r2[2])
                    cause = r2[2];
                const r = r2[0];
                const r3 = ps3.parse(s, r2[1], resin);
                if (!r3.length) {
                    if (detailedFail & 2 && cause)
                        addCause(cause);
                    return r3;
                }
                resin[0] = r;
                if (node)
                    closeNode(node, tree, resin);
                return resin;
            });
        }
    }
    function seq(name, ...parsers) {
        let nm;
        if (typeof name !== 'string')
            parsers.unshift(name);
        else
            nm = name;
        let ps;
        const len = parsers.length;
        return lazy(() => ps = parsers.map(unwrap), function parse(s, p, resin, tree) {
            const node = tree && openNode(p, nm);
            let res;
            let c = p;
            let causes;
            let r;
            r = ps[0].parse(s, c, resin, node);
            if (!r.length) {
                if (detailedFail & 2) {
                    const cause = getLatestCause(causes, getCauseCopy(nm));
                    return fail(cause[0], cause[1], cause[2], cause[3], cause[4]);
                }
                else
                    return r;
            }
            else {
                if (detailedFail & 2 && r[2])
                    (causes || (causes = [])).push(r[2]);
                (res = []).push(r[0]);
                c = r[1];
                for (let i = 1; i < len; i++) {
                    r = ps[i].parse(s, c, resin, node);
                    if (!r.length) {
                        if (detailedFail & 2) {
                            const cause = getLatestCause(causes, getCauseCopy(nm));
                            return fail(cause[0], cause[1], cause[2], cause[3], cause[4]);
                        }
                        else
                            return r;
                    }
                    else {
                        if (detailedFail & 2 && r[2])
                            (causes || (causes = [])).push(r[2]);
                        res.push(r[0]);
                        c = r[1];
                    }
                }
            }
            resin[0] = res;
            resin[1] = c;
            if (detailedFail & 2)
                resin[2] = [p, 'error in seq', null, null, causes];
            if (node)
                closeNode(node, tree, resin);
            return resin;
        });
    }
    shared.seq = seq;
    function check(name, ...parsers) {
        let ps;
        let nm;
        if (typeof name !== 'string')
            parsers.unshift(name);
        else
            nm = name;
        const len = parsers.length;
        return lazy(() => ps = parsers.map(unwrap), function parse(s, p, resin, tree) {
            const node = tree && openNode(p, nm);
            let c = p;
            let causes;
            let r;
            r = ps[0].parse(s, c, resin);
            if (!r.length) {
                if (detailedFail & 2) {
                    const cause = getLatestCause(causes, getCauseCopy(nm));
                    return fail(cause[0], cause[1], cause[2], cause[3], cause[4]);
                }
                else
                    return r;
            }
            else {
                if (detailedFail & 2 && r[2])
                    (causes || (causes = [])).push(r[2]);
                c = r[1];
                for (let i = 1; i < len; i++) {
                    r = ps[i].parse(s, c, resin);
                    if (!r.length) {
                        if (detailedFail & 2) {
                            const cause = getLatestCause(causes, getCauseCopy(nm));
                            return fail(cause[0], cause[1], cause[2], cause[3], cause[4]);
                        }
                        else
                            return r;
                    }
                    else {
                        if (detailedFail & 2 && r[2])
                            (causes || (causes = [])).push(r[2]);
                        c = r[1];
                    }
                }
            }
            resin[0] = null;
            resin[1] = c;
            if (node)
                closeNode(node, tree, resin);
            return resin;
        });
    }
    function andNot(parser, not, name) {
        let ps;
        let np;
        return lazy(() => (ps = unwrap(parser), np = unwrap(not)), function parse(s, p, resin, tree) {
            const node = tree && openNode(p, name);
            const res = ps.parse(s, p, resin, node);
            if (!res.length)
                return res;
            const c = res[1];
            const not = np.parse(s, c, resin);
            if (not.length)
                return fail(c, detailedFail & 1 && `unexpected ${s.slice(c, res[1])}`, name);
            else {
                if (node)
                    closeNode(node, tree, res);
                return res;
            }
        });
    }

    const _hex = 'abcdefABCDEF';
    const digits = '0123456789';
    const alpha = _hex + 'ghijklmnopqrstuvwxyzGHIJKLMNOPQRSTUVWXYZ';
    const identStart = _hex + alpha + '$_';
    const hex = _hex + digits;
    const space$3 = ' \t\n\r';
    const escmap$1 = { b: '\b', r: '\r', n: '\n', "'": "'", '"': '"', t: '\t', '\\': '\\' };
    const underscores = /_/g;
    const JNum = map(seq(opt(str('-', '+')), read1(digits), read(digits + '_'), opt(str(".")), read(digits + '_'), map(opt(seq(str('e', 'E'), opt(str('+', '-')), read1(digits + '_'))), r => r && concat$1(r))), r => +(concat$1(r).replace(underscores, '')));
    const JStringEscape = map(seq(str("\\"), notchars(1, 'xu')), r => escmap$1[r[1]] || r[1]);
    const JStringUnicode = map(seq(str("\\u"), chars(4, hex)), r => String.fromCharCode(parseInt(r[1], 16)));
    const JStringHex = map(seq(str('\\x'), chars(2, hex)), r => String.fromCharCode(parseInt(r[1], 16)));
    const JString = alt(bracket(str('"'), map(rep(alt('string part', read1To('"\\'), JStringUnicode, JStringHex, JStringEscape)), r => concat$1(r)), str('"')), bracket(str('\''), map(rep(alt('string part', read1To('\'\\'), JStringUnicode, JStringHex, JStringEscape)), r => concat$1(r)), str('\'')));
    const JBool = map(str('true', 'false'), v => v === 'true');
    const JNull = map(str('null'), () => null);
    const JIdentifier = map(seq(read1(identStart), opt(read(identStart + digits))), ([s, t]) => t !== null ? s + t : s);
    const ws = skip(space$3);
    const JArray = {};
    const JObject = {};
    const JValue = alt('value', JString, JArray, JObject, JNum, JBool, JNull);
    const JKeyPair = map(seq(ws, alt('key', JString, JIdentifier), check(ws, str(':'), ws), JValue), r => [r[1], r[3]]);
    JArray.parser = bracket(check(str('['), ws), repsep(JValue, check(ws, str(','), ws), 'allow'), check(ws, str(']')));
    JObject.parser = map(bracket(check(str('{'), ws), repsep(JKeyPair, check(ws, str(','), ws), 'allow'), check(ws, str('}'))), pairs => {
        const len = pairs.length;
        const res = {};
        for (let i = 0; i < len; i++) {
            const pair = pairs[i];
            res[pair[0]] = pair[1];
        }
        return res;
    });
    parser(map(seq(ws, JValue, ws), r => r[1]));

    const timespans = {
        y: 0,
        m: 0,
        w: 0,
        d: 86400000,
        h: 3600000,
        mm: 60000,
        s: 1000,
    };
    timespans.w = timespans.d * 7;
    timespans.y = Math.floor(timespans.d * 365.25);
    timespans.m = Math.floor(timespans.d * 30.45);
    function isTimespanMS(v) {
        return typeof v === 'object' && v && typeof v.ms === 'number';
    }
    function timeSpanToNumber(v) {
        if (typeof v === 'number')
            return v;
        else if (isTimespanMS(v))
            return v.ms;
        else
            return ((((((((((((v.d[0] || 0) * 12) + (v.d[1] || 0)) * 30.45) + (v.d[2] || 0)) * 24) + (v.d[3] || 0)) * 60) + (v.d[4] || 0)) * 60) + (v.d[5] || 0)) * 1000) + (v.d[6] || 0);
    }
    const space$2 = ' \r\n\t';
    const endSym = space$2 + '():{}[]<>,"\'`\\;&#';
    const endRef = endSym + '.+/*|^%=!?';
    const _comment = map(seq(ws, str('//'), opt(str(' ')), readTo('\n'), str('\n')), ([, , , c]) => ({ c }), { name: 'comment', primary: true });
    function comment(prop, p) {
        return map(seq(rep(_comment), ws, p), ([c, , v]) => {
            if (c && c.length)
                v[prop] = c.map(c => c.c);
            return v;
        });
    }
    const rws = skip1(space$2, 'required-space');
    const keywords = map(str('null', 'true', 'false', 'undefined'), v => {
        switch (v) {
            case 'null': return null;
            case 'true': return true;
            case 'false': return false;
            case 'undefined': return undefined;
        }
    }, { primary: true, name: 'primitive' });
    const ident = read1To(endRef, true);
    const sexprop = read1To(' \r\n\t():{}[],"\'\\;&#@', true);
    const args = {};
    const array = {};
    const block = {};
    const object = {};
    const value = {};
    const values$1 = {};
    const application = {};
    const escmap = { n: '\n', r: '\r', t: '\t', b: '\b' };
    const pathesc = map(seq(str('\\'), chars(1)), ([, char]) => escmap[char] || char);
    const pathident = map(rep1(alt('ref-part', read1To(endRef, true), pathesc)), parts => parts.join(''), 'keypath-part');
    const dotpath = map(seq(str('.'), pathident), ([, part]) => part);
    const bracketpath = bracket(seq(str('['), ws), value, seq(ws, str(']')));
    const keypath = map(seq(alt('ref-sigil', str('!', '~', '*'), seq(read('^'), opt(str('@', '.')))), alt('keypath', pathident, bracketpath), rep(alt('keypath', dotpath, bracketpath))), ([prefix, init, parts]) => {
        const res = { k: [init].concat(parts).map(p => typeof p === 'object' && 'v' in p && (typeof p.v === 'string' || typeof p.v === 'number') ? p.v : p) };
        if (Array.isArray(prefix)) {
            if (prefix[0])
                res.u = prefix[0].length;
            if (prefix[1] === '@')
                res.p = '@';
        }
        else if (prefix) {
            res.p = prefix;
        }
        return res;
    }, 'keypath');
    const localpath = map(seq(read('^'), pathident, rep(alt('keypath', dotpath, bracketpath))), ([prefix, init, parts]) => {
        const res = { k: [init].concat(parts).map(p => typeof p === 'object' && 'v' in p && (typeof p.v === 'string' || typeof p.v === 'number') ? p.v : p) };
        if (prefix)
            res.u = prefix.length;
        return res;
    }, 'localpath');
    const parsePath = parser(keypath);
    const parseLetPath = parser(localpath);
    const illegalRefs = ['if', 'else', 'elif', 'elseif', 'elsif', 'unless', 'then', 'case', 'when', 'not', 'gte', 'gt', 'lte', 'lt', 'in', 'like', 'ilike', 'not-in', 'not-like', 'not-ilike', 'contains', 'does-not-contain', 'is-not', 'is', 'strict-is-not', 'strict-is', 'deep-is-not', 'deep-is', 'and', 'or'];
    const ref = map(keypath, (r, err) => {
        if (r.k.length === 1 && !r.p && !r.u && illegalRefs.includes(r.k[0]))
            err(`invalid reference name '${r.k[0]}'`);
        return { r };
    }, { primary: true, name: 'reference' });
    function stringInterp(parts) {
        const res = parts.reduce((a, c) => {
            if (a.length) {
                if ('v' in c && 'v' in a[a.length - 1] && typeof c.v === 'string' && typeof a[a.length - 1].v === 'string')
                    a[a.length - 1].v += c.v;
                else
                    a.push(c);
            }
            else {
                a.push(c);
            }
            return a;
        }, []);
        if (res.length > 0 && (!('v' in res[0]) || typeof res[0].v !== 'string'))
            res.unshift({ v: '' });
        if (res.length === 0)
            return { v: '' };
        else if (res.length === 1)
            return res[0];
        return { op: '+', args: res };
    }
    const timespan = map(rep1sep(seq(JNum, ws, istr('years', 'year', 'y', 'months', 'month', 'minutes', 'minute', 'milliseconds', 'millisecond', 'mm', 'ms', 'm', 'weeks', 'week', 'w', 'days', 'day', 'd', 'hours', 'hour', 'h', 'seconds', 'second', 's')), ws), parts => {
        const span = { y: 0, m: 0, d: 0, h: 0, mm: 0, s: 0, ms: 0 };
        for (let i = 0; i < parts.length; i++) {
            if (parts[i][2][0] === 'y')
                span.y += parts[i][0];
            else if (parts[i][2] === 'm' || parts[i][2] === 'months' || parts[i][2] === 'month')
                span.m += parts[i][0];
            else if (parts[i][2][0] === 'd')
                span.d += parts[i][0];
            else if (parts[i][2][0] === 'w')
                span.d += parts[i][0] * 7;
            else if (parts[i][2][0] === 'h')
                span.h += parts[i][0];
            else if (parts[i][2][0] === 's')
                span.s += parts[i][0];
            else if (parts[i][2] === 'mm' || parts[i][2] === 'minutes' || parts[i][2] === 'minute')
                span.mm += parts[i][0];
            else if (parts[i][2] === 'ms' || parts[i][2] === 'milliseconds' || parts[i][2] === 'millisecond')
                span.ms += parts[i][0];
        }
        if (!span.y && !span.m && !span.d) {
            delete span.y;
            delete span.m;
            delete span.d;
            let n = 0;
            for (const k in span)
                n += span[k] * (timespans[k] || 1);
            return { ms: n };
        }
        else {
            const s = [];
            if (span.y)
                s[0] = span.y;
            if (span.m)
                s[1] = span.m;
            if (span.d)
                s[2] = span.d;
            if (span.h)
                s[3] = span.h;
            if (span.mm)
                s[4] = span.mm;
            if (span.s)
                s[5] = span.s;
            if (span.ms)
                s[6] = span.ms;
            return { d: s };
        }
    }, { primary: true, name: 'timespan' });
    const timezone = map(seq(ws, alt('timezone', istr('z'), seq(opt(chars(1, '+-')), alt(chars(4, digits), chars(2, digits), chars(1, digits)), opt(seq(str(':'), chars(2, digits)))))), v => {
        if (v[1][0] === 'z')
            return 0;
        else {
            let res;
            if (v[1][1].length === 4) {
                res = +v[1][1].substr(0, 2) * 60 + +v[1][1].substr(2, 2);
            }
            else {
                res = +v[1][1] * 60;
                if (v[1][2])
                    res += +v[1][2][1];
            }
            if (v[1][0] === '-')
                res *= -1;
            return res;
        }
    });
    const timeexact = alt(map(seq(read1(digits), opt(seq(str(':'), chars(2, digits), opt(seq(str(':'), chars(2, digits), opt(seq(str('.'), chars(3, digits)))))))), v => {
        const h = v[0];
        const m = v[1] && v[1][1];
        const s = m && v[1][2] && v[1][2][1];
        const ms = s && v[1][2][2] && v[1][2][2][1];
        const res = [+h];
        if (m)
            res[1] = +m;
        if (s)
            res[2] = +s;
        if (ms)
            res[3] = +ms;
        return res;
    }), map(istr('start', 'midnight'), () => [0, 0, 0, 0]), map(istr('noon', 'mid'), () => [12, 0, 0, 0]), map(istr('end'), () => [23, 59, 59, 999]));
    const parseTime = parser(alt(map(seq(timeexact, opt(seq(ws, timezone))), ([tm, z]) => {
        if (z)
            tm.push(z[1]);
        return tm;
    }), timezone), { trim: true, consumeAll: true, undefinedOnError: true });
    const dateend = opt(seq(ws, str('>')));
    const daterel = alt('date', map(seq(opt(istr('last', 'this', 'next')), rws, istr('week', 'month', 'year'), opt(timezone), dateend), ([o, , f, tz, e]) => {
        const val = { f: f[0] === 'w' ? 'w' : f[0] === 'm' ? 'm' : 'y', o: o === 'last' ? -1 : o === 'next' ? 1 : 0, e: e ? 1 : undefined };
        if (tz != null)
            val.z = tz;
        return val;
    }), map(seq(istr('week', 'month', 'year'), seq(rws, istr('to'), rws, istr('date')), opt(timezone), dateend), ([f, , tz, e]) => {
        const val = { f: f[0] === 'w' ? 'w' : f[0] === 'm' ? 'm' : 'y', o: 0, d: 1, e: e ? 1 : undefined };
        if (tz != null)
            val.z = tz;
        return val;
    }), map(seq(istr('yesterday', 'today', 'tomorrow'), alt(bracket(ws, istr('at'), ws), rws), timeexact, ws, opt(timezone)), v => {
        const res = { f: 'd', o: v[0] === 'yesterday' ? -1 : v[0] === 'today' ? 0 : 1, t: v[2] };
        if (v[4] != null)
            res.t[4] = v[4];
        return res;
    }), map(seq(istr('yesterday', 'today', 'tomorrow', 'now'), opt(timezone), dateend), ([v, tz, e]) => {
        const val = (v === 'now' ? { f: 'n', o: 0 } : { f: 'd', o: v === 'yesterday' ? -1 : v === 'today' ? 0 : 1, e: e ? 1 : undefined });
        if (tz != null)
            val.z = tz;
        return val;
    }), map(seq(istr('in'), rws, timespan), v => (typeof v[2] === 'number' || isTimespanMS(v[2]) ? { f: 'n', o: timeSpanToNumber(v[2]) } : { f: 'n', o: v[2].d })), map(seq(timespan, rws, alt('relative time anchor', istr('ago'), seq(istr('from'), rws, istr('now'))), opt(timezone)), ([span, , ref, tz]) => {
        let val;
        if (typeof span === 'number' || isTimespanMS(span)) {
            val = { f: 'n', o: timeSpanToNumber(span) * (ref === 'ago' ? -1 : 1) };
        }
        else {
            val = { f: 'n', o: span.d, d: ref === 'ago' ? -1 : undefined };
        }
        if (tz != null)
            val.z = tz;
        return val;
    }));
    function setIndex(array, index, value) {
        if (value == null)
            return array;
        array[index] = value;
        return array;
    }
    const dateexact = map(seq(chars(4, digits), opt(seq(chars(1, '-/'), read1(digits), opt(seq(chars(1, '-/'), read1(digits))))), opt(seq(alt(bracket(rws, istr('at'), rws), istr('t'), rws), timeexact)), opt(timezone), dateend), v => {
        const y = v[0];
        const m = v[1] && v[1][1];
        const d = m && v[1][2] && v[1][2][1];
        const time = v[2] && v[2][1];
        const tz = v[3];
        const e = v[4] ? 1 : undefined;
        if (!m)
            return { f: setIndex([+y], 7, tz), e };
        else if (!d)
            return { f: setIndex([+y, +m - 1], 7, tz), e };
        else if (!time)
            return { f: setIndex([+y, +m - 1, +d], 7, tz), e };
        else {
            const res = { f: [+y, +m - 1, +d], e };
            for (let i = 0; i < time.length; i++) {
                if (time[i] != null)
                    res.f[i + 3] = time[i];
            }
            if (tz != null)
                res.f[7] = tz;
            return res;
        }
    });
    const date$2 = bracket(str('#'), alt('date', dateexact, daterel, timespan), str('#'), { primary: true, name: 'date' });
    const typelit = map(seq(str('@['), ws, schema(), ws, str(']')), ([, , v]) => ({ v, s: 1 }), { name: 'typelit', primary: true });
    const parseDate = parser(map(seq(opt(str('#')), alt('date', dateexact, daterel, timespan), opt(str('#'))), ([, d,]) => d), { trim: true, consumeAll: true, undefinedOnError: true });
    const string = alt({ primary: true, name: 'string' }, map(seq(str(':'), read1To(endSym, true)), v => ({ v: v[1] })), map(bracket(str('"'), rep(alt('string-part', read1To('\\"'), JStringEscape, JStringUnicode, JStringHex)), str('"')), a => ({ v: ''.concat(...a) })), map(bracket(str(`'`), rep(alt('string-part', map(read1To(`'\\$\{`, true), v => ({ v })), map(str('\\$', '$$'), () => ({ v: '$' })), bracket(str('${', '{'), value, str('}'), { primary: true, name: 'string-interpolation' }), map(str('$', '{'), v => ({ v })), map(JStringUnicode, v => ({ v })), map(JStringHex, v => ({ v })), map(JStringEscape, v => ({ v })))), str(`'`)), stringInterp), map(bracket(str('`'), rep(alt('string-part', map(read1To('`\\${', true), v => ({ v })), map(str('\\$', '$$'), () => ({ v: '$' })), bracket(str('${'), value, str('}'), { primary: true, name: 'string-interpolation' }), map(str('$', '{'), v => ({ v })), map(JStringUnicode, v => ({ v })), map(JStringHex, v => ({ v })), map(JStringEscape, v => ({ v })))), str('`')), stringInterp));
    const literal = map(alt('literal', map(JNum, v => v, { primary: true, name: 'number' }), keywords, date$2), v => {
        if (v instanceof Date || v == null || typeof v !== 'object')
            return { v };
        else
            return v;
    });
    const sexp = map(bracket(check(str('('), ws), seq(sexprop, ws, args), check(ws, str(')'))), ([op, , args]) => {
        const res = { op };
        if (args[0] && args[0].length)
            res.args = args[0];
        if (args[1])
            res.opts = args[1];
        return res;
    }, { primary: true, name: 's-expression' });
    function fmt_op(parser) {
        return map(seq(parser, opt(seq(str('#'), ident, opt(alt(map(seq(str(','), rep1sep(value, str(','), 'allow')), ([, value]) => [value, undefined]), bracket_op(args)))), { primary: true, name: 'format-op' })), ([value, fmt]) => {
            if (!fmt)
                return value;
            if (fmt[2])
                return { op: 'fmt', args: [value, { v: fmt[1] }, ...(fmt[2][0] || [])], opts: fmt[2][1] };
            else
                return { op: 'fmt', args: [value, { v: fmt[1] }] };
        }, 'fmt-op');
    }
    function bracket_op(parser) {
        return bracket(seq(str('('), ws), parser, seq(ws, str(')')));
    }
    const binop = {};
    const if_op$1 = {};
    const case_op$1 = {};
    const opName = read1('abcdefghifghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_$0123456789');
    const call_op$1 = map(seq(name(opName, 'op'), bracket_op(args)), ([op, args]) => {
        const res = { op };
        if (args[0] && args[0].length)
            res.args = args[0];
        if (args[1])
            res.opts = args[1];
        return res;
    }, { primary: true, name: 'call' });
    const operand = fmt_op(postfix_path(alt('operand', bracket_op(application), bracket_op(if_op$1), bracket_op(case_op$1), verify(bracket_op(binop), v => 'op' in v || `expected bracketed op`), sexp, values$1)));
    const unop = map(seq(str('not ', '+'), operand), ([op, arg]) => ({ op: op === '+' ? op : 'not', args: [arg] }), 'unary op');
    function leftassoc(left, [, op, , right]) {
        return { op, args: [left, right] };
    }
    function rightassoc(left, more) {
        if (more.length === 1)
            return { op: more[0][1], args: [left, more[0][3]] };
        const end = more.pop();
        let op = more[more.length - 1][1];
        const first = { op: end[1], args: [more.pop()[3], end[3]] };
        const right = more.reverse().reduce((a, c) => {
            const res = { op, args: [c[3], a] };
            op = c[1];
            return res;
        }, first);
        return { op, args: [left, right] };
    }
    const binop_e = map(seq(operand, rep(seq(rws, name(str('**'), 'exp op'), rws, operand))), ([arg1, more]) => more.length ? rightassoc(arg1, more) : arg1, 'exp-op');
    const binop_md = map(seq(binop_e, rep(seq(rws, name(str('*', '/%', '/', '%'), 'muldiv-op'), rws, binop_e))), ([arg1, more]) => more.length ? more.reduce(leftassoc, arg1) : arg1, 'muldiv-op');
    const binop_as = map(seq(binop_md, rep(seq(rws, name(str('+', '-'), 'addsub-op'), rws, binop_md))), ([arg1, more]) => more.length ? more.reduce(leftassoc, arg1) : arg1, 'addsub-op');
    const binop_cmp = map(seq(binop_as, rep(seq(rws, name(str('>=', '>', '<=', '<', 'gte', 'gt', 'lte', 'lt', 'in', 'like', 'ilike', 'not-in', 'not-like', 'not-ilike', 'contains', 'does-not-contain'), 'cmp-op'), rws, binop_as))), ([arg1, more]) => more.length ? more.reduce(leftassoc, arg1) : arg1, 'cmp-op');
    const binop_eq = map(seq(binop_cmp, rep(seq(rws, name(str('is-not', 'is', 'strict-is-not', 'strict-is', 'deep-is-not', 'deep-is', '===', '==', '!==', '!='), 'eq-op'), rws, binop_cmp))), ([arg1, more]) => more.length ? more.reduce(leftassoc, arg1) : arg1, 'eq-op');
    const binop_and = map(seq(binop_eq, rep(seq(rws, name(str('and', '&&'), 'and-op'), rws, binop_eq))), ([arg1, more]) => more.length ? more.reduce(leftassoc, arg1) : arg1, 'and-op');
    const binop_or = map(seq(binop_and, rep(seq(rws, name(str('or', '||', '??'), 'or-op'), rws, binop_and))), ([arg1, more]) => more.length ? more.reduce(leftassoc, arg1) : arg1, 'or-op');
    binop.parser = map(binop_or, v => v, { primary: true, name: 'binary-op' });
    if_op$1.parser = alt({ primary: true, name: 'conditional' }, map(seq(str('if'), rws, value, rws, block, rep(seq(ws, str('else if', 'elseif', 'elsif', 'elif'), rws, value, rws, block)), opt(seq(ws, str('else'), rws, block))), ([, , cond1, , block1, elifs, el]) => {
        const op = { op: 'if', args: [cond1, block1] };
        for (const [, , , cond, , block] of elifs)
            op.args.push(cond, block);
        if (el)
            op.args.push(el[3]);
        return op;
    }, 'if-block'), map(seq(str('if'), rws, value, rws, str('then'), rws, value, rep(seq(rws, not(str('end', 'fi')), str('else if', 'elseif', 'elsif', 'elif'), rws, value, rws, str('then'), rws, value)), opt(seq(rws, str('else'), rws, value)), opt(seq(rws, str('end', 'fi')))), ([, , cond1, , , , val1, elifs, el]) => {
        const op = { op: 'if', args: [cond1, val1] };
        for (const [, , , , cond, , , , val] of elifs)
            op.args.push(cond, val);
        if (el)
            op.args.push(el[3]);
        return op;
    }, 'if'), map(seq(str('unless'), rws, value, rws, str('then'), rws, value, opt(seq(rws, str('else'), rws, value))), ([, , cond, , , , hit, miss]) => {
        const op = { op: 'unless', args: [cond, hit] };
        if (miss)
            op.args.push(miss[3]);
        return op;
    }));
    function replaceCase(op) {
        if (!op.args || !op.args.length)
            return false;
        let found = false;
        for (let i = 0; i < op.args.length; i++) {
            const arg = op.args[i];
            if ('r' in arg && (arg.r === '_' || (typeof arg.r === 'object' && arg.r.k[0] === '_'))) {
                arg.r = { k: ['case'].concat((arg.r.k || []).slice(1)), p: '@' };
                found = true;
            }
            else if ('r' in arg && typeof arg.r === 'object' && arg.r.p === '@' && arg.r.k[0] === 'case') {
                found = true;
            }
            else if ('op' in arg)
                found = found || replaceCase(arg);
        }
        return found;
    }
    const case_branch = alt(map(seq(rws, not(str('end', 'esac')), str('when'), rws, value, rws, str('then'), rws, value), ([, , , , cond, , , , hit]) => [cond, hit], 'when-branch'), map(seq(rws, not(str('end', 'esac')), str('else'), rws, value), ([, , , , hit]) => [undefined, hit], 'else-branch'), map(seq(rws, not(str('end', 'esac')), str('when'), rws, value, rws, block), ([, , , , cond, , hit]) => [cond, hit], 'when-block'));
    case_op$1.parser = alt(map(seq(str('case'), rws, value, rep(case_branch), opt(seq(rws, str('end', 'esac')))), ([, , val, branches]) => {
        const op = { op: 'case', args: [val] };
        for (let i = 0; i < branches.length; i++) {
            if (branches[i][0] === undefined)
                op.args.push(branches[i][1]);
            else {
                let arg = branches[i][0];
                if ('op' in arg)
                    replaceCase(arg);
                op.args.push(arg);
                op.args.push(branches[i][1]);
            }
        }
        return op;
    }, 'case'));
    function postfix_path(parser) {
        return map(seq(parser, rep(alt('keypath', dotpath, bracketpath))), ([v, k]) => {
            if (k.length)
                return { op: 'get', args: [v, { v: { k } }] };
            else
                return v;
        }, 'postfix-path-op');
    }
    const operation = alt('expression', if_op$1, case_op$1, binop);
    const pair = map(seq(alt('key', string, map(ident, v => ({ v }))), ws, str(':'), ws, value), t => [t[0], t[4]], 'pair');
    array.parser = map(bracket(check(ws, str('['), ws), repsep(value, read1(space$2 + ','), 'allow'), check(ws, str(']'))), args => args.filter(a => !('v' in a)).length ? { op: 'array', args } : { v: args.map(a => a.v) }, { primary: true, name: 'array' });
    function objectOp(pairs) {
        return pairs.filter(p => !('v' in p[0] && 'v' in p[1])).length ?
            { op: 'object', args: pairs.reduce((a, c) => (a.push(c[0], c[1]), a), []) } :
            { v: pairs.reduce((a, c) => (a[c[0].v] = c[1].v, a), {}) };
    }
    object.parser = map(bracket(check(ws, str('{'), ws), repsep(pair, read1(space$2 + ','), 'allow'), check(ws, str('}'))), objectOp, { primary: true, name: 'object' });
    block.parser = map(bracket(check(ws, str('{'), ws), rep1sep(value, read1(space$2 + ';'), 'allow'), check(ws, str('}'))), args => ({ op: 'block', args }), { primary: true, name: 'block' });
    value.parser = unwrap(comment('c', operation));
    const namedArg = map(seq(ident, str(':'), ws, value), ([k, , , v]) => [{ v: k }, v], 'named-arg');
    application.parser = map(seq(opt(bracket(check(str('|'), ws), rep1sep(opName, read1(space$2 + ','), 'allow'), str('|'))), ws, str('=>', '=\\'), ws, value), ([names, , , , value]) => (names ? { a: value, n: names } : { a: value }), { primary: true, name: 'application' });
    args.parser = map(repsep(alt('argument', namedArg, value), read1(space$2 + ','), 'allow'), (args) => {
        const [plain, obj] = args.reduce((a, c) => ((Array.isArray(c) ? a[1].push(c) : a[0].push(c)), a), [[], []]);
        if (obj.length)
            return [plain, objectOp(obj)];
        return [plain, undefined];
    });
    const letter = map(seq(str('let'), rws, name(localpath, { name: 'reference', primary: true }), ws, str('='), ws, value), ([, , k, , , , v]) => ({ op: 'let', args: [{ v: k }, v] }), { primary: true, name: 'let' });
    const setter = map(seq(str('set'), rws, name(keypath, { name: 'reference', primary: true }), ws, str('='), ws, value), ([, , k, , , , v]) => ({ op: 'set', args: [{ v: k }, v] }), { primary: true, name: 'set' });
    values$1.parser = alt('expression', array, object, literal, typelit, string, application, unop, call_op$1, letter, setter, ref, block);
    const parseBlock = parser(map(rep1sep(value, read1(space$2 + ';'), 'allow'), args => args.length === 1 ? args[0] : { op: 'block', args }, 'expression-sequence'), { trim: true });
    const parseExpr = parser(value, { trim: true });
    const parse$2 = parseBlock;
    function schema() {
        const type = {};
        const conditions = opt(seq(ws, rep1sep(map(seq(name(str('?'), { name: 'condition', primary: true }), ws, application), ([, , a]) => a), rws, 'disallow')));
        const value = map(seq(str('string[]', 'number[]', 'boolean[]', 'date[]', 'any', 'string', 'number', 'boolean', 'date'), not(read1To(endRef))), ([s]) => ({ type: s }), { name: 'type', primary: true });
        const typedef = comment('c', map(seq(str('type'), ws, name(ident, { name: 'type', primary: true }), ws, str('='), ws, type), ([, , name, , , , type]) => ({ name, type })));
        const typedefs = map(rep1sep(typedef, read1(' \t\n;'), 'disallow'), defs => defs.reduce((a, c) => (c.type.desc = c.c, a[c.name] = c.type, a), {}));
        const ref = map(seq(ident, opt(str('[]'))), ([ref, arr]) => ({ type: arr ? 'array' : 'any', ref }), { name: 'type', primary: true });
        const key = map(seq(name(ident, { name: 'key', primary: true }), opt(str('?')), ws, str(':'), ws, type), ([name, opt, , , , type]) => {
            const res = type;
            res.name = name;
            if (!opt)
                res.required = true;
            return res;
        });
        const literal = alt({ name: 'literal', primary: true }, map(alt(JString, JNum), v => {
            return { type: 'literal', literal: v };
        }), map(str('true', 'false', 'null', 'undefined'), v => {
            return { type: 'literal', literal: v === 'true' ? true : v === 'false' ? false : v === 'null' ? null : undefined };
        }));
        const rest = map(seq(str('...'), ws, str(':'), ws, type), ([, , , , type]) => {
            return Object.assign({ name: '...' }, type);
        });
        const object = map(seq(str('{'), ws, repsep(comment('desc', alt(key, rest)), read1(' \t\n,;'), 'allow'), ws, str('}'), opt(str('[]'))), ([, , keys, , , arr], fail) => {
            const rests = keys.filter(k => k.name === '...');
            if (rests.length > 1)
                fail('only one object rest can be specified');
            else {
                const rest = rests[0];
                keys = keys.filter(k => k.name !== '...');
                const type = { type: arr ? 'object[]' : 'object' };
                if (keys.length)
                    type.fields = keys;
                if (rest) {
                    delete rest.name;
                    type.rest = rest;
                }
                return type;
            }
        });
        const tuple = map(seq(str('['), ws, repsep(type, read1(' \t\r\n,'), 'allow'), ws, str(']'), opt(str('[]'))), ([, , types, , , arr]) => {
            return { type: arr ? 'tuple[]' : 'tuple', types };
        });
        const maybe_union = map(rep1sep(seq(alt(value, object, tuple, literal, ref), conditions), seq(ws, str('|'), ws), 'disallow'), list => {
            const types = list.map(([t, c]) => {
                if (c && c[1] && c[1].length)
                    t.checks = c[1];
                return t;
            });
            if (types.length === 1)
                return types[0];
            else
                return { type: 'union', types: types };
        });
        const union_array = alt(map(seq(str('Array<'), ws, maybe_union, ws, str('>')), ([, , union], fail) => {
            if (union.type === 'union')
                return { type: 'union[]', types: union.types };
            else if (union.type === 'literal')
                fail('literal types cannot be array types');
            else if (union.type === 'array' || ~union.type.indexOf('[]'))
                fail('array types cannot be array types');
            else if (union.type === 'any')
                fail('any cannot be an array type');
            else {
                union.type += '[]';
                return union;
            }
        }), map(seq(str('('), ws, maybe_union, ws, str(')')), ([, , union]) => union), maybe_union);
        type.parser = map(seq(union_array, conditions), ([type, checks]) => {
            if (checks && checks[1] && checks[1].length)
                type.checks = checks[1];
            return type;
        });
        const root = map(seq(opt(typedefs), ws, type), ([defs, , type]) => {
            if (defs)
                type.defs = defs;
            return type;
        });
        return root;
    }

    const endTxt = '\\{';
    const txtEsc = alt(map(str('\\{{'), () => '{{'), map(seq(str('\\'), chars(1)), ([, c]) => c));
    const text = map(rep1(alt(read1To(endTxt, true), txtEsc, andNot(str('{'), str('{')))), txts => ({ v: txts.join('') }), 'text');
    function tag_value(names) {
        return map(seq(str('{{'), ws, str(...names), rws, value, ws, str('}}')), arr => [arr[2], arr[4]], 'tag');
    }
    function case_value(names) {
        return map(seq(str('{{'), ws, str(...names), rws, value, rws, str('when'), rws, value, str('}}')), arr => [arr[2], arr[4], arr[8]], 'tag');
    }
    const tag_end = name(check(seq(str('{{/'), readTo('}'), str('}}'))), 'tag end');
    const content = {};
    function branch(names, value) {
        if (value)
            return map(tag_value(names), ([name, value]) => ({ name, value }));
        else
            return map(seq(str('{{'), ws, str(...names), ws, str('}}')), ([, , name]) => ({ name }), 'tag');
    }
    function min_one(values) {
        return map(values, v => v.length < 1 ? [{ v: '' }] : v);
    }
    const else_tag = branch(['else']);
    const branch_tag = branch(['else if', 'elseif', 'elsif', 'elif'], true);
    const each_op = map(seq(tag_value(['each']), min_one(rep(alt(branch_tag, else_tag, content))), tag_end), ([tag, content]) => ({ op: 'each', args: [tag[1]].concat(apply_first(cond_branches(content))) }), { primary: true, name: 'each-block' });
    const if_op = map(seq(tag_value(['if']), min_one(rep(alt(branch_tag, else_tag, content))), tag_end), ([tag, content]) => ({ op: 'if', args: [tag[1]].concat(cond_branches(content)) }), { primary: true, name: 'if-block' });
    const with_op = map(seq(tag_value(['with']), min_one(rep(alt(else_tag, content))), tag_end), ([tag, content]) => ({ op: 'with', args: [tag[1]].concat(apply_first(cond_branches(content))) }), { primary: true, name: 'with-block' });
    const unless_op = map(seq(tag_value(['unless']), min_one(rep(content)), tag_end), ([tag, content]) => ({ op: 'unless', args: [tag[1]].concat(concat(content)) }), { primary: true, name: 'unless-block' });
    const case_op = map(seq(case_value(['case']), min_one(rep(alt(branch(['when'], true), else_tag, content))), tag_end), ([tag, content]) => {
        const op = { op: 'case', args: tag.slice(1).concat(cond_branches(content)) };
        for (let i = 1; i < op.args.length; i += 2) {
            const arg = op.args[i];
            if (typeof arg === 'object' && 'op' in arg)
                replaceCase(arg);
        }
        return op;
    }, { primary: true, name: 'case-block' });
    const interpolator = map(seq(str('{{'), ws, value, ws, str('}}')), ([, , value]) => ({ op: 'string', args: [value] }), { primary: true, name: 'interpolator' });
    content.parser = alt({ primary: true, name: 'content' }, text, each_op, if_op, with_op, case_op, unless_op, interpolator);
    function apply_first(content) {
        if (content.length)
            content[0] = { a: content[0] };
        return content;
    }
    function cond_branches(content) {
        const res = [];
        let args = [];
        let hasTag = false;
        for (let i = 0; i < content.length; i++) {
            const c = content[i];
            if ('name' in c) {
                hasTag = true;
                if (args.length)
                    res.push(concat(args));
                else
                    res.push({ v: '' });
                if (c.value)
                    res.push(c.value);
                args = [];
            }
            else
                args.push(c);
        }
        if (args.length)
            res.push(concat(args));
        else if (hasTag)
            res.push({ v: '' });
        if (res.length % 2)
            res.push({ v: '' });
        return res;
    }
    function concat(values) {
        if (values.length === 1)
            return values[0];
        return { op: '+', args: values };
    }
    const parse$1 = parser(alt(map(rep1(content), args => concat(args)), map(ws, () => ({ v: '' }))), { trim: true });

    // eval
    function getKeypath(ref) {
        if (typeof ref.r === 'object')
            return ref.r;
        const path = parsePath(ref.r);
        if ('k' in path)
            return path;
        else
            return { k: [] };
    }
    function safeGet(root, path) {
        if (!path)
            return root.value;
        const p = typeof path === 'string' ? parsePath(path) : path;
        if ('error' in p)
            return;
        else if ('k' in p) {
            let parts = p.k;
            const prefix = p.p;
            let idx = 0;
            let ctx = root;
            let o = root.value;
            for (let i = 0; i < p.u; i++)
                ctx && (ctx = ctx.parent);
            o = ctx ? ctx.value : undefined;
            if (prefix) {
                if (prefix === '!')
                    o = root.root.parameters;
                else if (prefix === '~')
                    o = root.root.value;
                else if (prefix === '*') {
                    o = root.root.sources[parts[idx++]];
                    if (o && idx < parts.length + 1 && parts[idx] !== 'value')
                        o = o.value;
                }
                else if (prefix === '@') {
                    const which = parts[idx++];
                    if (which === 'locals' || which === 'specials') {
                        const key = which === 'locals' ? which : 'special';
                        while (ctx) {
                            if (ctx[key])
                                break;
                            ctx = ctx.parent;
                        }
                        if (ctx)
                            o = ctx[key];
                    }
                    else if (which === 'local' || which === 'special') {
                        const key = which === 'local' ? 'locals' : which;
                        o = ctx[key] || (ctx[key] = {});
                    }
                    else if (which === 'parameters' || which === 'sources') {
                        o = root.root[which];
                    }
                    else if (which !== 'value') {
                        while (ctx && (!ctx.special || !(which in ctx.special)))
                            ctx = ctx.parent;
                        o = ctx && ctx.special[which];
                        if (o && which === 'source' && parts[idx] !== undefined && parts[idx] !== 'value' && o.value)
                            o = o.value;
                        if (!o && which === 'date')
                            o = root.root.special.date = new Date();
                    }
                }
            }
            else {
                const first = parts[0];
                if (first === '_') {
                    if (ctx.special && ctx.special.pipe)
                        o = ctx.special.pipe;
                    idx++;
                }
                else if (typeof first === 'string') {
                    let lctx = ctx;
                    while (lctx && (!lctx.locals || !(first in lctx.locals)))
                        lctx = lctx.parent;
                    if (lctx && first in lctx.locals) {
                        o = lctx.locals[first];
                        idx++;
                    }
                }
            }
            for (let i = idx; i < parts.length; i++) {
                const part = parts[i];
                const v = typeof part !== 'object' ? part : evalValue(root, part);
                if (Array.isArray(o) && typeof v === 'number' && v < 0)
                    o = o[o.length + v];
                else
                    o = o && o[v];
                if (o === null || o === undefined)
                    return;
            }
            return o;
        }
    }
    function safeSet(root, path, value, islet) {
        if (!path)
            return;
        const p = typeof path === 'string' ? (islet ? parseLetPath(path) : parsePath(path)) : path;
        if ('error' in p)
            return;
        else if ('k' in p) {
            let parts = p.k;
            const prefix = p.p;
            let ctx = root;
            let o = root.value;
            for (let i = 0; i < p.u; i++)
                ctx && (ctx = ctx.parent);
            o = ctx ? ctx.value : undefined;
            const keys = parts.map(p => typeof p !== 'object' ? p : evalValue(root, p));
            if (islet) {
                o = root.locals || (root.locals = {});
            }
            else if (prefix) {
                if (prefix === '~')
                    o = root.root.value;
                else
                    return;
            }
            if (!islet) {
                const first = keys[0];
                while (ctx) {
                    if (ctx.locals && first in ctx.locals)
                        break;
                    ctx = ctx.parent;
                }
                if (ctx)
                    o = ctx.locals;
            }
            const last = keys.length - 1;
            for (let i = 0; i < last; i++) {
                if (typeof o !== 'object' && typeof o !== 'function' || !o)
                    return;
                const key = keys[i];
                const next = keys[i + 1];
                if (!(key in o) || o[key] == null)
                    o[key] = typeof next === 'number' ? [] : {};
                o = o[key];
            }
            if (o) {
                const cur = o[keys[last]];
                o[keys[last]] = value;
                return cur;
            }
        }
    }
    function evaluate(root, value) {
        let r;
        let e;
        if (isValueOrExpr(root)) {
            r = new Root();
            e = root;
        }
        else if (isContext(root)) {
            r = root;
            !Array.isArray(value) && (e = value);
        }
        else if (root && typeof root === 'object' && 'context' in root && isContext(root.context)) {
            r = root.context;
            !Array.isArray(value) && (e = value);
        }
        else if (isValueOrExpr(value)) {
            r = new Root(root);
            e = value;
        }
        else {
            r = new Root();
            e = root;
        }
        return evalParse(r, e);
    }
    function template(root, template) {
        let r;
        let t;
        if (typeof root === 'string') {
            r = new Root();
            t = root;
        }
        else if (isContext(root)) {
            r = root;
            t = template || '';
        }
        else if (root && typeof root === 'object' && 'context' in root && isContext(root.context)) {
            r = root.context;
            t = template || '';
        }
        else {
            r = new Root();
            t = root;
        }
        r = extend$1(r, { parser: parse$1 });
        return evalParse(r, t);
    }
    /**
     * Evaluate an applicative with the given locals, naming them if the applicative declares named arguments.
     * If swap is not true, then a new context extension will be used. Otherwise, the context locals will be
     * swapped for the evaluation and replaced afterwards. Swap should only be used for applications that are
     * passing the context value as the first local.
     */
    function evalApply(ctx, value, locals, swap, special) {
        if (isApplication(value)) {
            const c = swap ? ctx : extend$1(ctx, { value: locals[0], special });
            const l = ctx.locals;
            let res;
            if ('n' in value) {
                const map = value.n.reduce((a, c, i) => (a[c] = locals[i], a), {});
                c.locals = map;
            }
            res = evalValue(c, value.a);
            c.locals = l;
            return res;
        }
        else {
            const v = evalParse(ctx, value);
            if (isApplication(v))
                return evalApply(ctx, v, locals, false, special);
            else
                return v;
        }
    }
    function evalParse(ctx, expr) {
        if (typeof expr === 'string')
            expr = ctx.root.exprs[expr] || (ctx.root.exprs[expr] = (ctx.parser || parse$2)(expr));
        if (typeof expr !== 'object')
            expr = { v: expr };
        return evalValue(ctx, expr);
    }
    function evalValue(ctx, expr) {
        if (!expr)
            return expr;
        if ('r' in expr)
            return safeGet(ctx, expr.r);
        else if ('v' in expr)
            return expr.v;
        else if ('op' in expr)
            return applyOperator(ctx, expr);
        else if (isApplication(expr))
            return expr;
        else if (isDateRel(expr) || isTimespan(expr))
            return expr;
    }
    const opMap = {};
    function registerOperator(...ops) {
        for (const op of ops) {
            for (const name of op.names)
                opMap[name] = op;
        }
    }
    function unregisterOperator(...ops) {
        for (const op of ops) {
            for (const name of op.names)
                delete opMap[name];
        }
    }
    function getOperatorMap() {
        return Object.assign({}, opMap);
    }
    function getOperator(name) {
        return opMap[name];
    }
    function mungeSort(context, sorts) {
        let sortArr;
        if (Array.isArray(sorts)) {
            sortArr = sorts;
        }
        else {
            const s = evalParse(context, sorts);
            if (Array.isArray(s))
                sortArr = s;
            else if (typeof s === 'string')
                sortArr = [{ v: s }];
        }
        if (sortArr) {
            let el;
            for (let i = 0; i < sortArr.length; i++) {
                el = sortArr[i];
                const by = isLiteral(el) ? el.v : el;
                if (typeof by === 'string') {
                    if (by[0] === '-')
                        sortArr[i] = { by: by.substr(1), desc: true };
                    else
                        sortArr[i] = { by: by[0] === '+' ? by.substr(1) : by, desc: false };
                }
            }
        }
        return sortArr;
    }
    function filter(ds, filter, sorts, groups, context) {
        const _ds = Array.isArray(ds) ? { value: ds } : ds;
        if (!_ds || !Array.isArray(_ds.value))
            return _ds;
        let _context;
        if (!context)
            _context = new Root(_ds.value, { special: { source: _ds } });
        else if (isContext(context))
            _context = extend$1(context, { special: { source: _ds.value } });
        else
            _context = new Root(context);
        const values = filter ? [] : _ds.value.slice();
        if (filter) {
            let flt = typeof filter === 'string' ? parse$2(filter) : filter;
            if ('m' in flt)
                flt = { v: true };
            _ds.value.forEach((row, index) => {
                if (!!evalApply(extend$1(_context, { value: row, special: { value: row, index } }), flt, [row, index]))
                    values.push(row);
            });
        }
        const sortArr = mungeSort(_context, sorts);
        if (sortArr && sortArr.length) {
            const dirs = sortArr.map(s => {
                if (typeof s === 'object') {
                    if ('by' in s) {
                        if ('desc' in s) {
                            if (typeof s.desc === 'boolean')
                                return s.desc;
                            return evalParse(_context, s.desc);
                        }
                        else if ('dir' in s) {
                            const lower = typeof s.dir === 'string' ? s.dir.toLowerCase() : s.dir;
                            const dir = lower === 'asc' || lower === 'desc' ? lower : evalParse(_context, s.dir);
                            const val = typeof dir === 'string' ? dir.toLowerCase() : dir;
                            if (val === 'desc')
                                return true;
                        }
                    }
                }
                // default to asc
                return false;
            });
            values.sort((a, b) => {
                for (let i = 0; i < sortArr.length; i++) {
                    const s = sortArr[i];
                    const desc = dirs[i];
                    const by = typeof s === 'string' ? s : s && s.by ? s.by : s;
                    const l = evalApply(_context, by, [a]);
                    const r = evalApply(_context, by, [b]);
                    const cmp = l == null && r != null ? -1
                        : l != null && r == null ? 1
                            : (l < r) === (r < l) ? 0
                                : l < r ? -1
                                    : l > r ? 1
                                        : 0;
                    if (cmp)
                        return (desc ? -1 : 1) * cmp;
                }
                return 0;
            });
        }
        if (groups && !Array.isArray(groups))
            groups = [groups];
        if (Array.isArray(groups) && groups.length) {
            return { value: { schema: _ds.schema, grouped: groups.length, level: 0, value: group(values, groups, _context, 1), all: values } };
        }
        if (Array.isArray(ds))
            return values;
        else
            return { schema: _ds.schema, value: values };
    }
    function group(arr, groups, ctx, level = 0) {
        const cache = {};
        const res = [];
        const order = [];
        for (const e of arr) {
            const g = isApplication(groups[0]) ? `${evalApply(ctx, groups[0], [e])}` : `${evalParse(extend$1(ctx, { value: e }), groups[0])}`;
            if (!cache[g]) {
                order.push(g);
                cache[g] = [];
            }
            cache[g].push(e);
        }
        for (const k of order) {
            res.push({ group: k, grouped: groups.length - 1, value: groups.length > 1 ? group(cache[k], groups.slice(1), ctx, level + 1) : cache[k], all: cache[k], level });
        }
        return res;
    }
    function hasPipeRef(ref) {
        const path = getKeypath(ref);
        return path.k[0] === '_' || path.p === '@' && path.k[0] === 'pipe';
    }
    function applyOperator(root, operation) {
        const op = opMap[operation.op];
        // if the operator doesn't exist, try a local, pipe, or skip
        if (!op) {
            const local = safeGet(root, operation.op) || safeGet(root.root, operation.op);
            if (isApplication(local)) {
                return evalApply(root, local, operation.args.map(a => evalParse(root, a)));
            }
            else if (operation.op === 'pipe') { // handle the special built-in pipe operator
                if (!operation.args || !operation.args.length)
                    return true;
                let v = evalParse(root, operation.args[0]);
                for (let i = 1; i < operation.args.length; i++) {
                    let a = operation.args[i];
                    if (isOperation(a) && (!a.args || !a.args.find(a => isReference(a) && hasPipeRef(a))))
                        a = Object.assign({}, a, { args: [{ r: { k: ['pipe'], p: '@' } }].concat(a.args || []) });
                    if (isApplication(a))
                        v = evalApply(root, a, [v]);
                    else
                        v = evalParse(extend$1(root, { special: { pipe: v } }), a);
                }
                return v;
            }
            return true;
        }
        let args;
        if (op.type === 'checked') {
            args = [];
            const flts = operation.args || [];
            const ctx = op.extend ? extend$1(root, {}) : root;
            const opts = operation.opts ? evalParse(ctx, operation.opts) : undefined;
            for (let i = 0; i < flts.length; i++) {
                const a = flts[i];
                const arg = evalParse(ctx, a);
                const res = op.checkArg(operation.op, i, flts.length - 1, arg, opts, ctx, a);
                if (res === 'continue')
                    args.push(arg);
                else if ('skip' in res) {
                    i += res.skip;
                    if ('value' in res)
                        args.push(res.value);
                }
                else if ('result' in res)
                    return res.result;
            }
            return op.apply(operation.op, args, opts, ctx);
        }
        else if (op.type === 'value') {
            args = (operation.args || []).map(a => evalParse(root, a));
            return op.apply(operation.op, args, operation.opts ? evalParse(root, operation.opts) : undefined, root);
        }
        else {
            let arr;
            const ctx = op.extend ? extend$1(root, {}) : root;
            const args = (operation.args || []).slice();
            const opts = operation.opts ? evalParse(ctx, operation.opts) : undefined;
            let arg;
            if (!op.value) {
                arg = evalParse(ctx, args[0]);
                if (Array.isArray(arg)) {
                    args.shift();
                    arr = arg;
                }
                else if (typeof arg === 'object' && 'value' in arg && Array.isArray(arg.value)) {
                    args.shift();
                    arr = arg.value;
                }
                if (!arr) {
                    const src = evalValue(ctx, { r: '@source' });
                    if (Array.isArray(src))
                        arr = src;
                    else if (typeof src === 'object' && 'value' in src && Array.isArray(src.value))
                        arr = src.value;
                    else
                        arr = [];
                }
            }
            return op.apply(operation.op, Array.isArray(arr) ? arr : [], args, opts, ctx);
        }
    }
    function isKeypath(v) {
        return typeof v === 'string' || (typeof v === 'object' && Array.isArray(v.k));
    }
    function isLiteral(v) {
        return typeof v === 'object' && 'v' in v;
    }
    function isReference(v) {
        return typeof v === 'object' && 'r' in v;
    }
    function isOperation(v) {
        return typeof v === 'object' && typeof v.op === 'string';
    }
    function isApplication(v) {
        if (typeof v !== 'object' || !('a' in v) || typeof v.a !== 'object')
            return false;
        const len = Object.keys(v).length;
        return len === 1 || len === 2 && 'n' in v;
    }
    function isValueOrExpr(o) {
        return typeof o === 'string' || isValue(o);
    }
    function isValue(o) {
        return typeof o === 'object' && o && (('r' in o && typeof o.r === 'string') ||
            ('op' in o && typeof o.op === 'string') ||
            ('v' in o) ||
            (isApplication(o)));
    }
    function isContext(v) {
        return typeof v === 'object' && typeof v.path === 'string' && typeof v.root == 'object' && 'value' in v && (typeof v.parent === 'object' || v.root === v);
    }
    class Root {
        constructor(root = {}, opts) {
            this.root = this;
            this.parameters = {};
            this.sources = {};
            this.special = {};
            this.exprs = {};
            this.path = '';
            this.value = root;
            if (opts) {
                Object.assign(this.parameters, opts.parameters);
                Object.assign(this.special, opts.special);
                if (opts.parser)
                    this.parser = opts.parser;
            }
        }
    }
    function join$1(context, path) {
        return {
            parent: context,
            root: context.root,
            path: context.path ? `${context.path}.${path}` : path,
            value: safeGet(context, path)
        };
    }
    function extend$1(context, opts) {
        return {
            parent: context,
            root: context.root,
            path: opts.path || '',
            value: 'value' in opts ? opts.value : context.value,
            special: opts.special || {},
            parser: opts.parser,
            locals: opts.locals,
        };
    }
    const formats = {};
    function registerFormat(name, format, defaults = {}) {
        if (Array.isArray(name))
            name.forEach(n => formats[n] = { apply: format, defaults });
        else
            formats[name] = { apply: format, defaults };
    }
    function unregisterFormat(name) {
        delete formats[name];
    }
    function dateRelToRange(rel) {
        if (rel instanceof Date)
            return [rel, rel];
        let from = new Date();
        let to = 'd' in rel && rel.d ? new Date() : undefined;
        from.setUTCFullYear(from.getFullYear(), from.getMonth(), from.getDate());
        from.setUTCHours(0, 0, 0, 0);
        let tz = 'z' in rel && rel.z != null ? rel.z : null;
        if (rel.f === 'n') { // DateRelSpan (MS or Full)
            from = typeof rel.o === 'number' ? new Date(+new Date() + rel.o) : dateAndTimespan(new Date(), { d: rel.o }, 'd' in rel ? rel.d : 1);
            to = from;
            tz = undefined;
        }
        else if (rel.f === 'd') { // DateRelRange - day
            from.setUTCDate(from.getUTCDate() + rel.o);
            if (!to)
                to = new Date(from);
            if ('t' in rel) { // DateRelTimeRange
                const t = rel.t;
                from.setUTCHours(t[0], t[1] || 0, t[2] || 0, t[3] || 0);
                to.setUTCHours(t[0], t[1] == null ? 59 : t[1], t[2] == null ? 59 : t[2], t[3] == null ? 999 : t[3]);
                if (t[4] != null)
                    tz = t[4];
            }
        }
        else if (rel.f === 'w') { // DateRelRange - week
            from.setUTCDate(from.getUTCDate() - (from.getUTCDay() + (rel.o === -1 ? 7 : rel.o === 1 ? -7 : 0)));
            if (!to) {
                to = new Date(from);
                to.setDate(from.getUTCDate() + 6);
            }
            if ('z' in rel && rel.z != null)
                tz = rel.z;
        }
        else if (rel.f === 'm') { // DateRelRange - month
            from.setUTCDate(1);
            from.setUTCMonth(from.getUTCMonth() + rel.o);
            if (!to) {
                to = new Date(from);
                to.setUTCMonth(from.getUTCMonth() + 1);
                to.setUTCDate(0);
            }
        }
        else if (rel.f === 'y') { // DateRelRange - year
            from.setUTCDate(1);
            from.setUTCMonth(0);
            from.setUTCDate(1);
            if (!to) {
                to = new Date(from);
                to.setUTCFullYear(from.getUTCFullYear() + 1);
                to.setUTCDate(0);
            }
        }
        else if (Array.isArray(rel.f)) { // DateExactRange
            const v = rel.f.slice();
            from = new Date(Date.UTC(v[0], v[1] || 0, v[2] || 1, v[3] || 0, v[4] || 0, v[5] || 0, v[6] || 0));
            for (let i = 1; i < 7; i++) {
                if (v[i] == null) {
                    v[i - 1]++;
                    break;
                }
            }
            if (v[6] != null)
                v[6]++;
            to = new Date(Date.UTC(v[0], v[1] || 0, v[2] || 1, v[3] || 0, v[4] || 0, v[5] || 0, v[6] || 0));
            to.setUTCMilliseconds(to.getUTCMilliseconds() - 1);
            if (v[7] != null)
                tz = v[7];
        }
        if (rel.f === 'd' || rel.f === 'w' || rel.f === 'm' || rel.f === 'y')
            to.setUTCHours(23, 59, 59, 999);
        if (tz !== undefined) {
            if (tz != null) {
                from.setUTCMinutes(from.getUTCMinutes() - tz);
                if (from !== to)
                    to.setUTCMinutes(to.getUTCMinutes() - tz);
            }
            else { // shift to local time
                const offset = from.getTimezoneOffset();
                from.setUTCMinutes(from.getUTCMinutes() + offset);
                if (from !== to)
                    to.setUTCMinutes(to.getUTCMinutes() + offset);
            }
        }
        return [from, to];
    }
    function isDateRel(v) {
        return v && typeof v === 'object' && (('f' in v && (Array.isArray(v.f) || 'o' in v)) || v instanceof Date);
    }
    function isDateExactRange(v) {
        return v && typeof v === 'object' && 'f' in v && Array.isArray(v.f);
    }
    function dateRelToDate(rel) {
        const range = dateRelToRange(rel);
        if ('e' in rel && rel.e != null)
            return range[1];
        else
            return range[0];
    }
    function dateRelToExactRange(rel) {
        if (!rel)
            return;
        if (isDateExactRange(rel))
            return rel;
        const dt = dateRelToDate(rel);
        const offset = dt.getTimezoneOffset();
        const z = 'z' in rel && rel.z != null ? rel.z : 'f' in rel && rel.f === 'd' && 't' in rel && rel.t[4] != null ? rel.t[4] : null;
        if (rel instanceof Date && z != null)
            dt.setMinutes(dt.getMinutes() - (offset + z));
        return {
            f: [dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds(), z != null ? z : -offset],
        };
    }
    function isTimespan(v) {
        return typeof v === 'number' || (typeof v === 'object' && Array.isArray(v.d)) || isTimespanMS(v);
    }
    function addTimespan(l, r) {
        if (typeof l === 'number' && typeof r === 'number')
            return l + r;
        else {
            const res = { d: [] };
            if (typeof l === 'number')
                res.d[6] = l;
            else if (isTimespanMS(l))
                res.d[6] = l.ms;
            else
                for (let i = 0; i < 7; i++)
                    if (l.d[i])
                        res.d[i] = l.d[i];
            if (typeof r === 'number')
                res.d[6] = (res.d[6] || 0) + r;
            else if (isTimespanMS(r))
                res.d[6] = (res.d[6] || 0) + r.ms;
            else
                for (let i = 0; i < 7; i++)
                    if (r.d[i])
                        res.d[i] = (res.d[i] || 0) + r.d[i];
            return res;
        }
    }
    function datesDiff(l, r) {
        if (isNaN(+l) || isNaN(+r))
            return { d: [] };
        if (r < l) {
            const s = r;
            r = l;
            l = s;
        }
        const a = new Date(l);
        const b = r;
        const res = { d: [0, 0, 0, 0, 0, 0, 0], s: +a };
        let num = b.getFullYear() - a.getFullYear() - 1;
        let tmp1, tmp2;
        if (num > 0) {
            res.d[0] += num;
            a.setFullYear(b.getFullYear() - 1);
        }
        a.setFullYear(a.getFullYear() + 1);
        if (a > b)
            a.setFullYear(a.getFullYear() - 1);
        else
            res.d[0]++;
        // watch out for leap year
        if (l.getMonth() === 1 && l.getDate() === 29 && a.getMonth() !== 1) {
            a.setDate(29);
            a.setMonth(1);
        }
        // jumping months can make days get weird
        while (true) {
            num = a.getDate();
            tmp1 = a.getMonth();
            tmp2 = a.getFullYear();
            a.setDate(num + 1);
            if (a.getMonth() !== tmp1) {
                a.setDate(1);
                a.setMonth(tmp1 + 2);
                a.setDate(0);
            }
            else {
                a.setDate(num);
                a.setMonth(tmp1 + 1);
                if (tmp1 === 11 ? a.getMonth() !== 0 : a.getMonth() !== tmp1 + 1) {
                    a.setDate(1);
                    a.setMonth(tmp1 + 2);
                    a.setDate(0);
                }
            }
            if (a > b) {
                // make sure we stay in the correct year
                a.setFullYear(tmp2);
                a.setDate(1);
                a.setMonth(tmp1);
                a.setDate(num);
                break;
            }
            else
                res.d[1]++;
        }
        while (true) {
            a.setDate(a.getDate() + 1);
            if (a > b) {
                a.setDate(a.getDate() - 1);
                break;
            }
            else
                res.d[2]++;
        }
        while (true) {
            a.setHours(a.getHours() + 1);
            if (a > b) {
                a.setHours(a.getHours() - 1);
                break;
            }
            else
                res.d[3]++;
        }
        while (true) {
            a.setMinutes(a.getMinutes() + 1);
            if (a > b) {
                a.setMinutes(a.getMinutes() - 1);
                break;
            }
            else
                res.d[4]++;
        }
        while (true) {
            a.setSeconds(a.getSeconds() + 1);
            if (a > b) {
                a.setSeconds(a.getSeconds() - 1);
                break;
            }
            else
                res.d[5]++;
        }
        if (a.getMilliseconds() <= b.getMilliseconds())
            res.d[6] = b.getMilliseconds() - a.getMilliseconds();
        else
            res.d[6] = (1000 - a.getMilliseconds()) + b.getMilliseconds();
        return res;
    }
    function dateAndTimespan(l, r, m) {
        if (typeof r === 'number')
            return new Date(+l + r * m);
        else if (isTimespanMS(r))
            return new Date(+l + r.ms * m);
        else {
            let d = new Date(l);
            if (r.d[0])
                d.setFullYear(d.getFullYear() + r.d[0] * m);
            if (r.d[1]) {
                const dd = d.getDate();
                d.setDate(1);
                d.setMonth(d.getMonth() + r.d[1] * m);
                const mm = d.getMonth();
                d.setDate(dd);
                if (mm !== d.getMonth())
                    d.setDate(0);
            }
            if (r.d[2])
                d.setDate(d.getDate() + r.d[2] * m);
            if (r.d[3])
                d.setHours(d.getHours() + r.d[3] * m);
            if (r.d[4])
                d.setMinutes(d.getMinutes() + r.d[4] * m);
            if (r.d[5])
                d.setSeconds(d.getSeconds() + r.d[5] * m);
            if (r.d[6])
                d.setMilliseconds(d.getMilliseconds() + r.d[6] * m);
            return d;
        }
    }

    function addStyle(context, id, style) {
        if (!context.styles[id])
            context.styles[id] = style;
    }
    function isComputed(v) {
        return typeof v === 'object' && isValueOrExpr(v.x);
    }
    function maybeComputed(v, context) {
        if (!isComputed(v))
            return v;
        else if (v.x)
            return evaluate(context, v.x);
    }
    function extend(context, opts) {
        return { report: context.report, context: extend$1(context.context, opts), styles: context.styles, styleMap: context.styleMap };
    }
    const htmlChars = /\>\<\&/g;
    const htmlReplace = { '<': '&lt;', '>': '&gt;', '&': '&amp;' };
    function escapeHTML(html) {
        return ('' + html).replace(htmlChars, m => htmlReplace[m] || '');
    }
    const renderers = {};
    function registerRenderer(type, renderer, options) {
        renderers[type] = typeof renderer === 'function' ? { render: renderer } : renderer;
        if (options)
            Object.assign(renderers[type], options);
    }
    /** Decent guesstimates for char width at 16px/em */
    const avgs = {
        sans: 7.4,
        serif: 6.7,
        mono: 7.85,
        narrow: 5.9,
    };
    /** Text height measurement function for the given text, font, available width in rem, and line height in rem.
     * The text is assumed to be rendered as white-space: pre-wrap.
     */
    function measureEstimate(text, width, context, font) {
        const family = (font && maybeComputed(font.family, context)) || 'sans';
        const size = (font && maybeComputed(font.size, context)) || 0.83;
        const avg = (((font && maybeComputed(font.metric, context)) || ((family === 'mono' || /fixed|mono/i.test(family) ? avgs.mono :
            family === 'narrow' || /narrow|condensed/i.test(family) ? avgs.narrow :
                family === 'sans' || /sans|arial|helvetica/i.test(family) ? avgs.sans :
                    avgs.serif))) * size) / 16;
        const lines = text.split(/\r?\n/g);
        return lines.reduce((a, c) => {
            const [word, lines] = c.split(/\s/g).reduce((a, c) => {
                const wlen = (c.length + 1) * avg;
                if (a[0] + wlen > width) {
                    a[0] = wlen;
                    a[1]++;
                }
                else {
                    a[0] += wlen;
                }
                return a;
            }, [0, 0]);
            return a + ((lines + (word > 0 ? 1 : 0)) || 1);
        }, 0) * size;
    }
    /** Text height measurement function for the given text, font, available width in rem, and line height in rem.
     * The text is assumed to be rendered as white-space: pre-wrap.
     */
    let measure = measureEstimate;
    /** Render the given widget to string or a continuation using a registered renderer */
    function renderWidget(w, context, placement, state) {
        const renderer = renderers[w.type];
        if (!renderer || (w.hide && evaluate(extend$1(context.context, { special: { widget: w, placement } }), w.hide)))
            return { output: '', height: 0 };
        if (!('height' in w) && renderer.container)
            w.height = 'auto';
        const h = getHeightWithMargin(w, placement, context);
        if (placement.maxY && !isNaN(h) && h > placement.maxY) {
            addStyle(context, 'error', `.error { position: absolute; box-sizing: border-box; color: red; border: 1px dotted; width: 100%; height: 2rem; padding: 0.5rem; }`);
            return { output: `<div class="error" style="top: ${placement.y}rem;">Widget overflow error</div>`, height: 2 };
        }
        if (placement.availableY && h > placement.availableY)
            return { output: '', continue: { offset: 0 }, cancel: true };
        let extraHeight = 0;
        if (w.margin) {
            const m = expandMargin(w, context, placement);
            extraHeight += m[0] + m[2];
            if (placement.availableY)
                placement.availableY -= m[0] + m[2];
        }
        const r = renderer.render(w, context, placement, state);
        if (typeof r === 'string')
            return { output: r, height: h, width: getWidthWithMargin(w, placement, context) };
        if (placement.maxY && r.height > placement.maxY) {
            addStyle(context, 'error', `.error { position: absolute; box-sizing: border-box; color: red; border: 1px dotted; width: 100%; height: 2rem; padding: 0.5rem; }`);
            return { output: `<div class="error" style="top: ${placement.y}rem;">Widget overflow error</div>`, height: 2 };
        }
        if (isNaN(h) && placement.availableY && r.height > placement.availableY)
            return { output: '', continue: { offset: 0 }, height: r.height, cancel: true };
        r.height = r.height || 0;
        r.height += extraHeight;
        return r;
    }
    const layouts = {};
    function registerLayout(name, layout) {
        layouts[name] = layout;
    }
    registerLayout('row', (w, o, m, p, ps, context) => {
        let n;
        const availableX = p.maxX - ps[0][0] - ps[0][2];
        const nw = getWidthWithMargin(w, { x: p.x, y: p.y, maxX: p.maxX, maxY: p.maxY, availableY: p.availableY, availableX }, context);
        const br = isComputed(w.br) ? evaluate(extend$1(context.context, { special: { placement: p, widget: w } }), w.br.x) : w.br;
        if (br || ps[0][0] + ps[0][2] + nw > p.maxX) {
            n = { x: m[3], y: maxYOffset(ps), availableX: p.maxX, maxX: p.maxX };
        }
        else {
            n = { x: ps[0][0] + ps[0][2], y: ps[0][1], availableX, maxX: p.maxX };
        }
        n.y -= o;
        if (p.availableY)
            n.availableY = p.availableY - ps[0][1] - n.y;
        return n;
    });
    /** Render child widgets handling continuation across pages */
    function renderWidgets(widget, context, placement, state, layout) {
        if (Array.isArray(widget.widgets)) {
            let s = '';
            const offset = (state || { offset: 0 }).offset;
            const ps = [[0, offset, 0, 0]];
            const m = expandMargin(widget, context, placement);
            ps[0][0] += m[3];
            ps[0][1] += m[0];
            for (let i = state && state.last || 0; i < widget.widgets.length; i++) {
                const w = widget.widgets[i];
                if (w.hide && evaluate(extend$1(context.context, { special: { widget: w, placement } }), w.hide))
                    continue;
                // allow widgets that are taller than max height to be dropped
                let h = placement && getHeightWithMargin(w, placement, context);
                if (h > placement.maxY)
                    h = 1;
                if (placement && placement.availableY && h > placement.availableY) {
                    const offset = maxYOffset(ps);
                    state = state || { offset };
                    state.last = i;
                    return { output: s, continue: state, height: offset };
                }
                else {
                    let lp = Array.isArray(layout) && (layout[i] || [0, 0]);
                    if (!lp || !Array.isArray(lp))
                        lp = [0, 0];
                    if (!lp[0])
                        lp[0] = 0;
                    if (!lp[1])
                        lp[1] = 0;
                    let p = Array.isArray(lp) ? { x: lp[0] < 0 ? lp[0] : lp[0] + m[3], y: lp[1] < 0 ? lp[1] : lp[1] + m[0], maxX: placement.maxX } : (lp || placement);
                    if (Array.isArray(lp))
                        p.availableX = p.maxX - p.x;
                    if (!layout || typeof layout === 'string') {
                        const l = layout ? layouts[layout] || layouts.row : layouts.row;
                        p = l(w, offset, m, placement, ps, context);
                    }
                    p.maxX = p.maxX || placement.maxX;
                    p.maxY = p.maxY || placement.maxY;
                    if (p.x < 0) {
                        p.offsetX = m[3];
                        p.x = (placement.availableX || 1) + p.x - getWidthWithMargin(w, placement, context) + 1;
                    }
                    if (p.y < 0) {
                        p.offsetY = m[0];
                        p.y = (placement.availableY || 1) + p.y - h + 1;
                    }
                    const { x, y } = p;
                    const r = renderWidget(w, context, p, state && state.child);
                    // skip empty output
                    if (typeof r === 'string' && !r || (!r.cancel && !r.output && !r.height))
                        continue;
                    if (typeof r === 'string') {
                        s += r;
                        ps.unshift([x, y, getWidthWithMargin(w, placement, context), getHeightWithMargin(w, placement, context)]);
                    }
                    else {
                        if (r.cancel)
                            return { output: '', cancel: true };
                        const h = r.height || getHeightWithMargin(w, placement, context) || 0;
                        if (y + h > placement.availableY) {
                            const offset = maxYOffset(ps);
                            state = state || { offset };
                            state.last = i;
                            state.attempt = (+state.attempt || 0) + 1;
                            if (state.attempt > 1) {
                                addStyle(context, 'error', `.error { position: absolute; box-sizing: border-box; color: red; border: 1px dotted; width: 100%; height: 2rem; padding: 0.5rem; }`);
                                return { output: `<div class="error" style="bottom: 0rem;">Widget overflow error</div>`, height: 2 };
                            }
                            return { output: s, continue: state, height: offset };
                        }
                        s += r.output;
                        ps.unshift([x, y, r.width || getWidthWithMargin(w, placement, context), h]);
                        if (r.continue) {
                            state = state || { offset: 0 };
                            state.child = r.continue;
                            state.last = i;
                            state.offset = maxYOffset(ps);
                            return { output: s, continue: state, height: maxYOffset(ps), width: maxXOffset(ps) };
                        }
                    }
                    if (p.availableX === 0)
                        ps[0][2] = p.maxX;
                }
            }
            return { output: s, height: getHeightWithMargin(widget, placement, context) || maxYOffset(ps) - m[0], width: getWidthWithMargin(widget, placement, context) || maxXOffset(ps) - m[3] };
        }
        return { output: '', height: 0 };
    }
    function getWidth(w, placement, context) {
        let width = isComputed(w.width) ? evaluate(extend$1(context.context, { special: { widget: w, placement } }), w.width.x) : w.width;
        const m = w.margin && expandMargin(w, context, placement);
        let pct = false;
        if (width === 'grow')
            width = placement.availableX || placement.maxX;
        else if (!width && width !== 0)
            width = placement.maxX || 51;
        else if (typeof width === 'number')
            ;
        else {
            width = +((width.percent / 100) * (placement.maxX || 51)).toFixed(4);
            pct = true;
        }
        if (typeof width === 'number' && (w.box === 'contain' || pct && w.box !== 'expand')) {
            if (m)
                width -= m[1] + m[3];
            else if (w.font && w.font.right)
                width -= w.font.right;
        }
        return width;
    }
    function getWidthWithMargin(w, placement, context) {
        let r = getWidth(w, placement, context);
        if (w.margin) {
            const m = expandMargin(w, context, placement);
            r += m[1] + m[3];
        }
        else if (w.font && w.font.right) {
            r += w.font.right;
        }
        return r;
    }
    function maxFontSize(w) {
        let n = w.height || 1;
        if (w.font && w.font.size > n)
            n = w.font.size;
        if ('text' in w && Array.isArray(w.text)) {
            for (let i = 0; i < w.text.length; i++) {
                if (typeof w.text[i] === 'object' && w.text[i].font && w.text[i].font.size > n)
                    n = w.text[i].font.size;
            }
        }
        return n;
    }
    function getHeight(w, placement, context, computed, linesize) {
        let r = 1;
        let h = isComputed(w.height) ? evaluate(extend$1(context.context, { special: { widget: w, placement, computed, linesize } }), w.height.x) : w.height;
        const m = w.margin && expandMargin(w, context, placement);
        let pct = false;
        if (h == null && linesize)
            h = maxFontSize(w);
        if (typeof h === 'number')
            r = h;
        else if (typeof h === 'object' && 'percent' in h && h.percent && placement.maxY) {
            r = +(placement.maxY * (h.percent / 100)).toFixed(4);
            pct = true;
        }
        else if (h === 'auto' || (computed && !h))
            return computed || NaN;
        else if (h === 'grow') {
            r = placement.availableY || 0;
            if (w.margin) {
                const m = expandMargin(w, context, placement);
                r -= m[0] + m[2];
            }
        }
        if (typeof r === 'number' && (w.box === 'contain' || pct && w.box !== 'expand') && m)
            r -= m[0] + m[2];
        return r;
    }
    function getHeightWithMargin(w, placement, context, computed, linesize) {
        let h = getHeight(w, placement, context, computed, linesize);
        if (w.margin) {
            const m = expandMargin(w, context, placement);
            h += m[0] + m[2];
        }
        return h;
    }
    function maxYOffset(points) {
        return points.reduce((a, c) => a > c[1] + c[3] ? a : c[1] + c[3], 0);
    }
    function maxXOffset(points) {
        return points.reduce((a, c) => a > c[0] + c[2] ? a : c[0] + c[2], 0);
    }
    function expandMargin(w, context, placement) {
        if (w.margin) {
            const m = isComputed(w.margin) ? evaluate(extend$1(context.context, { special: { widget: w, placement } }), w.margin.x) : w.margin;
            if (Array.isArray(m)) {
                if (m.length === 4)
                    return m.map(e => +e);
                else if (m.length === 2)
                    return [+m[0], +m[1], +m[0], +m[1]];
            }
            else if (typeof m === 'number')
                return [m, m, m, m];
        }
        return [0, 0, 0, 0];
    }

    function nextStyleId(ctx, prefix) {
        if (!ctx.styleMap.ids[prefix])
            ctx.styleMap.ids[prefix] = 0;
        return ctx.styleMap.ids[prefix]++;
    }
    function mapStyle(ctx, style, prefix) {
        if (!style)
            return '';
        const mapped = ctx.styleMap.styles[style];
        if (mapped)
            return mapped;
        const id = `${prefix}${nextStyleId(ctx, prefix)}`;
        return ctx.styleMap.styles[style] = id;
    }
    function styleClass(ctx, cls, [style, inline], inlineStyle, classPrefix) {
        if (ctx.report.classifyStyles !== false) {
            const cs = [];
            if (inline)
                cs.push(mapStyle(ctx, inline, 'h'));
            cs.push(mapStyle(ctx, style, classPrefix || 's'));
            return ` class="${cls.concat(cs).join(' ')}"${inlineStyle ? ` style="${inlineStyle}"` : ''}`;
        }
        else {
            const s = `${style}${inlineStyle || ''}${inline || ''}`;
            const c = `${cls.length ? ` class="${cls.join(' ')}"` : ''}`;
            return `${c}${s ? ` style="${s}"` : ''}`;
        }
    }
    function style(w, placement, context, opts) {
        let s = `left:${(placement.x || 0) + (placement.offsetX || 0)}rem;top:${((placement.y || 0) + (placement.offsetY || 0))}rem;`;
        let i = ``;
        s += `width:${getWidthWithMargin(w, placement, context)}rem;`;
        let h = getHeightWithMargin(w, placement, context, opts && opts.computedHeight, opts && opts.lineSize) || 1;
        if (w.height === 'grow' && w.margin) {
            const m = expandMargin(w, context, placement);
            h += m[0] + m[2];
        }
        if (opts && opts.container && opts.computedHeight)
            i = `height:${h}rem;`;
        else
            s += `height:${h}rem;`;
        const line = w.font && maybeComputed(w.font.line, context);
        const size = w.font && maybeComputed(w.font.size, context);
        s += `${!opts || !opts.container || line ? `line-height:${(line || size) || getHeight(w, placement, context, opts && opts.computedHeight, opts && opts.lineSize)}rem;` : ''}`;
        if (w.margin) {
            const m = expandMargin(w, context, placement);
            if (m[0] || m[1] || m[2] || m[3])
                s += `padding:${m[0]}rem ${m[1]}rem ${m[2]}rem ${m[3]}rem;`;
        }
        else if (w.font && w.font.right) {
            s += `padding-right:${w.font.right}rem;`;
        }
        if ((opts && opts.font) || w.font)
            s += styleFont((opts && opts.font) || w.font, context);
        if (w.border)
            s += styleBorder(w.border, context);
        s += styleExtra(w, context);
        return [s, i];
    }
    function styleExtra(w, context) {
        let s = '';
        const bg = maybeComputed(w.bg, context);
        if (bg)
            s += `background-color:${bg};`;
        const radius = maybeComputed(w.radius, context);
        if (radius)
            s += `border-radius:${radius};`;
        return s;
    }
    function styleFont(f, context) {
        if (!f)
            return '';
        let t;
        let size;
        let s = '';
        if (t = maybeComputed(f.family, context))
            s += `font-family:${t};`;
        if (t = maybeComputed(f.color, context))
            s += `color:${t};`;
        if (t = maybeComputed(f.align, context))
            s += `text-align:${t};`;
        if (t = maybeComputed(f.size, context)) {
            s += `font-size:${t}rem;`;
            size = t;
        }
        t = maybeComputed(f.line, context);
        if (t === 0)
            s += `line-height:initial;`;
        else if (t != null)
            s += `line-height:${t}rem;`;
        else if (size)
            s += `line-height:${size}rem;`;
        if (t = maybeComputed(f.weight, context))
            s += `font-weight:${t};`;
        if (t = maybeComputed(f.pre, context))
            s += `white-space:pre-wrap;`;
        if (t = maybeComputed(f.clamp, context))
            s += `white-space:nowrap;overflow:hidden;`;
        return s;
    }
    function styleBorder(b, context) {
        if (typeof b === 'string' || (typeof b === 'object' && ('v' in b || 'r' in b || 'op' in b)))
            b = evaluate(context, b);
        if (typeof b === 'number')
            return `border-bottom:${b * 0.0625}rem solid;`;
        else if (isBorder(b))
            return `border-style:solid;border-width:${(b.top || 0) * 0.0625}rem ${(b.right || 0) * 0.0625}rem ${(b.bottom || 0) * 0.0625}rem ${(b.left || 0) * 0.0625}rem;`;
        else if (Array.isArray(b)) {
            if (b.length === 1)
                return `border:${(+b[0] || 0) * 0.0625}rem solid;`;
            else if (b.length === 2)
                return `border-style:solid;border-width:${(+b[0] || 0) * 0.0625}rem ${(+b[1] || 0) * 0.0625}rem ${(+b[0] || 0) * 0.0625}rem ${(+b[1] || 0) * 0.0625}rem;`;
            else if (b.length === 3)
                return `border-style:solid;border-width:${(+b[0] || 0) * 0.0625}rem ${(+b[1] || 0) * 0.0625}rem ${(+b[2] || 0) * 0.0625}rem ${(+b[1] || 0) * 0.0625}rem;`;
            else if (b.length === 4)
                return `border-style:solid;border-width:${(+b[0] || 0) * 0.0625}rem ${(+b[1] || 0) * 0.0625}rem ${(+b[2] || 0) * 0.0625}rem ${(+b[3] || 0) * 0.0625}rem;`;
        }
    }
    function isBorder(b) {
        return typeof b === 'object' && ('top' in b || 'bottom' in b || 'left' in b || 'right' in b);
    }
    function styleImage(fit) {
        const s = `background-size:${!fit || fit === 'contain' ? 'contain;background-position:center' : fit === 'stretch' ? '100% 100%' : 'cover'};`;
        return [s, ''];
    }

    const PageSizes = {
        letter: {
            width: 51,
            height: 66,
            margin: [1.5, 1.5],
        },
        legal: {
            width: 51,
            height: 84,
            margin: [1.5, 1.5],
        },
        tabloid: {
            width: 66,
            height: 102,
            margin: [1.5, 1.5],
        },
        a4: {
            width: 49.606302,
            height: 70.15746,
            margin: [1.5, 1.5],
        }
    };
    /** Initialize a parameter map based on the parameters defined by the given report. */
    function initParameters(report, sources, parameters) {
        const ctx = parameters && 'root' in parameters && parameters.root === parameters ? parameters : new Root(Object.assign({}, report.context), { parameters });
        ctx.parameters = Object.assign({}, report.defaultParams, ctx.parameters);
        const inits = {};
        if (report.sources)
            applySources(ctx, report.sources, sources);
        if (Array.isArray(report.parameters)) {
            for (const p of report.parameters) {
                if (p.init && p.name) {
                    inits[p.name] = evaluate(ctx, p.init);
                }
            }
        }
        return inits;
    }
    /** Run the given report to string. If the report is displayed, the result will be HTML. Otherwise, it will be plain text. */
    function run(report, sources, parameters, extra) {
        const ctx = parameters && 'root' in parameters && parameters.root === parameters ? parameters : new Root(Object.assign({}, report.context), { parameters });
        if (report.sources)
            applySources(ctx, report.sources, sources);
        ctx.parameters = Object.assign({}, initParameters(report, sources), ctx.parameters);
        if (report.extraContext) {
            const res = evaluate(ctx, report.extraContext);
            if (res && typeof res === 'object')
                ctx.value = Object.assign(ctx.value, res);
        }
        if (report.type === 'delimited')
            return runDelimited(report, ctx);
        else if (report.type === 'flow')
            return runFlow(report, ctx, extra);
        else
            return runPage(report, ctx, extra);
    }
    /** Apply multiple sources to a context together. Each source base is available before filter/sort/group is applied in case a source needs to reference a later source for those purposes. */
    function applySources(context, sources, map) {
        const srcs = context.sources;
        for (const source of sources) {
            let base = map[source.source || source.name] || { value: [] };
            if (source.base)
                base = { value: evaluate(extend$1(context, { value: base.value, special: { source: base } }), source.base) };
            srcs[source.name || source.source] = base;
        }
        for (const source of sources) {
            if (source.filter || source.sort || source.group)
                srcs[source.name || source.source] = filter(srcs[source.name || source.source], source.filter, source.sort, source.group, context);
        }
    }
    function applySource(context, source, sources) {
        let base = sources[source.source || source.name] || { value: [] };
        if (source.base)
            base = { value: evaluate(extend$1(context, { value: base.value, special: { source: base } }), source.base) };
        if (source.filter || source.sort || source.group)
            context.sources[source.name || source.source] = filter(base, source.filter, source.sort, source.group, context);
        else
            context.sources[source.name || source.source] = base;
    }
    function runDelimited(report, context) {
        const source = context.root.sources[report.source ? report.source : (report.sources[0].name || report.sources[0].source)];
        const values = Array.isArray(source.value) ?
            source.value :
            typeof source.value === 'object' && 'grouped' in source.value && Array.isArray(source.value.all) ? // watch out for grouped sources
                source.value.all :
                [source.value];
        let fields = report.fields;
        let headers = report.headers;
        if (!fields || !fields.length && values.length) {
            fields = Object.keys(values[0]);
            if (!headers || !headers.length)
                headers = Object.keys(values[0]).map(k => `'${k.replace(/'/g, '\\\'')}'`);
        }
        let res = '';
        if (headers) {
            const ctx = extend$1(context, { parser: parse$1 });
            res += headers.map(h => `${report.quote || ''}${evaluate(ctx, h)}${report.quote || ''}`).join(report.field || ',') + (report.record || '\n');
        }
        const unquote = report.quote ? new RegExp(report.quote, 'g') : undefined;
        for (const value of values) {
            const c = extend$1(context, { value });
            res += fields.map(f => {
                let val = f ? `${evaluate(c, f)}` : '';
                if (unquote)
                    val = val.replace(unquote, report.quote + report.quote);
                return `${report.quote || ''}${val}${report.quote || ''}`;
            }).join(report.field || ',') + (report.record || '\n');
        }
        return res;
    }
    function runPage(report, context, extras) {
        let size = report.orientation !== 'portrait' ? { width: report.size.height, height: report.size.width, margin: [report.size.margin[1], report.size.margin[0]] } : report.size;
        const ctx = { context, report, styles: {}, styleMap: { ids: {}, styles: {} } };
        context.special = context.special || {};
        context.special.page = 0;
        context.special.pages = 0;
        const pages = [''];
        let page = 0;
        let availableY = size.height - 2 * size.margin[0];
        const pageY = availableY;
        let maxY = availableY;
        let y = 0;
        const availableX = size.width - 2 * size.margin[1];
        let state = null;
        let headSize = 0;
        if (report.header) {
            const r = renderWidget(report.header, ctx, { x: 0, y: 0, availableX, availableY, maxX: availableX, maxY });
            headSize = r.height;
            availableY -= headSize;
            maxY -= headSize;
            y += headSize;
        }
        let footSize = 0;
        if (report.footer) {
            const r = renderWidget(report.footer, ctx, { x: 0, y: 0, availableX, availableY, maxX: availableX, maxY });
            footSize = r.height;
            availableY -= footSize;
            maxY -= footSize;
        }
        for (const w of report.widgets) {
            let r;
            do {
                r = renderWidget(w, ctx, { x: 0, y, availableX, availableY, maxX: availableX, maxY }, state);
                pages[page] += r.output;
                if (r.continue) {
                    page++;
                    pages[page] = '';
                    y = headSize;
                    availableY = size.height - 2 * size.margin[0] - headSize - footSize;
                    state = r.continue;
                }
                else {
                    y += r.height;
                    availableY -= r.height;
                    state = null;
                }
            } while (state !== null);
        }
        context.special.pages = pages.length;
        const footTop = size.height - 2 * size.margin[0] - footSize;
        context.special.size = { x: availableX, y: pageY };
        pages.forEach((p, i) => {
            let n = `<div class="page-back pb${i}"><div${styleClass(ctx, ['page', `ps${i}`], ['', ''], '', 'p')}>\n`;
            context.special.page = i + 1;
            if (report.watermark) {
                const r = renderWidget(report.watermark, ctx, { x: 0, y: 0, maxX: availableX, maxY: pageY });
                n += r.output + '\n';
            }
            if (report.header) {
                const r = renderWidget(report.header, ctx, { x: 0, y: 0, maxX: availableX, maxY });
                n += r.output + '\n';
            }
            n += p;
            if (report.footer) {
                const r = renderWidget(report.footer, ctx, { x: 0, y: footTop, maxX: availableX, maxY });
                n += r.output + '\n';
            }
            if (report.overlay) {
                const r = renderWidget(report.overlay, ctx, { x: 0, y: 0, maxX: availableX, maxY: pageY });
                n += r.output + '\n';
            }
            n += '\n</div></div>';
            pages[i] = n;
        });
        return `<html style="font-size:100%;margin:0;padding:0;"><head><style>
    .page { width: ${size.width - 2 * size.margin[1]}rem; height: ${size.height - 2 * size.margin[0]}rem; position: absolute; overflow: hidden; left: ${size.margin[1]}rem; top: ${size.margin[0]}rem; ${report.font ? styleFont(report.font, ctx) : ''} }
    .page-back { width: ${size.width}rem; height: ${size.height}rem; }
    body { font-size: 0.83rem; }
    @media screen {
      html { min-width: ${size.width + 2}rem; }
      body { background-color: #999; display: flex; flex-direction: column; align-items: center; }
      .page-back { background-color: #fff; box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.4); position: relative; overflow: hidden; box-sizing: border-box; margin: 0.5em; }
    }
    @media print {
      body { margin: 0; padding: 0; ${size ? `width:${size.width}rem;` : ''}background-color: none; display: block; height: ${pages.length * size.height}rem }
      .page-back { position: absolute; box-shadow: none; background-color: none; margin: 0; padding: 0; left: 0rem; }
      ${pages.map((_p, i) => `.pb${i} { top: ${i * size.height}rem; }`).join('')}
    }
    @page {
      size: ${size.width}em ${size.height}em;
    }${Object.entries(ctx.styles).map(([_k, v]) => v).join('\n')}${Object.entries(ctx.styleMap.styles).map(([style, id]) => `.${id} { ${style} }`).join('\n')}
  </style>${extras && extras.head || ''}</head><body>\n${pages.reduce((a, c) => a + c, '')}${extras && extras.foot || ''}</body></html>`;
    }
    function runFlow(report, context, extras) {
        const ctx = { context, report, styles: {}, styleMap: { ids: {}, styles: {} } };
        let html = '';
        let y = 0;
        let state = null;
        let width;
        const margin = report.size && report.size.margin ? expandMargin(report.size, ctx, { x: 0, y: 0, availableX: width, maxX: width }) : [1.5, 1.5, 1.5, 1.5];
        if (report.width)
            width = report.width;
        else if (report.size)
            width = report.orientation !== 'portrait' ? report.size.height : report.size.width;
        // account for margins
        if (width)
            width -= (margin[1] || 0) + (margin[3] || 0);
        function render(w, cls) {
            html += `<div${styleClass(ctx, cls ? [cls] : [], [`position:absolute;right:0rem;left:0rem;${width ? `width:${width}rem;` : ''}`, ''], `top:${y}rem;`, 'p')}>\n`;
            let r;
            let yy = 0;
            do {
                r = renderWidget(w, ctx, { x: 0, y: yy, availableX: width, maxX: width }, state);
                if (typeof r === 'string')
                    throw new Error(`Container widget didn't specify used height`);
                else {
                    html += r.output;
                    yy += r.height;
                    if (r.continue) {
                        state = r.continue;
                    }
                    else {
                        state = null;
                    }
                }
            } while (state !== null);
            y += yy;
            html += `</div>\n`;
        }
        if (report.watermark)
            render(report.watermark, 'watermark');
        let maxY = y || 0;
        y = 0;
        for (const w of report.widgets)
            render(w, 'main');
        if (y > maxY)
            maxY = y;
        y = 0;
        if (report.overlay)
            render(report.overlay, 'overlay');
        if (y > maxY)
            maxY = y;
        return `<html><head><style>
    html { font-size: 100%; margin: 0; padding: 0; }
    body { font-size: 0.83rem; padding: 0; margin: 0;${width ? ` width: ${width}rem;` : ''}; height: ${maxY}rem; position: relative; }
    .page-back { ${width ? `width: ${width}rem; ` : ''}height: ${maxY}rem; padding: ${margin[0] || 0}rem ${margin[1] || 0}rem ${margin[2] || 0}rem ${margin[3] || 0}rem; position: absolute; left: 0; top: 0; }
    #wrapper { height:${maxY}rem; position: relative; ${report.font ? styleFont(report.font, ctx) : ''} }
    .watermark { z-index: 0; }
    .main { z-index: 5; }
    .overlay { z-index: 10; }
    @media screen {
      body { margin: 1rem${width ? ' auto' : ''}; background-color: #fff; box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.4); padding: ${margin[0]}rem ${margin[1]}rem ${margin[2]}rem ${margin[3]}rem !important; }
      html { background-color: #999; }
    }${Object.entries(ctx.styles).map(([_k, v]) => v).join('\n')}${Object.entries(ctx.styleMap.styles).map(([style, id]) => `.${id} { ${style} }`).join('\n')}
  </style>${extras && extras.head || ''}</head><body>\n<div class=page-back><div id=wrapper>${html}</div></div>${extras && extras.foot || ''}</body></html>`;
    }

    registerRenderer('label', (w, ctx, placement) => {
        addStyle(ctx, 'label', `.label {position:absolute;box-sizing:border-box;}`);
        let str = '';
        let sval;
        let val = (Array.isArray(w.text) ? w.text : [w.text]).map(v => {
            let val = evaluate(ctx, typeof v === 'object' && 'text' in v ? v.text : v);
            if (typeof v === 'object' && 'id' in v) {
                let c = ctx.context;
                while (c) {
                    if (c.special && c.special.values)
                        (c.special.values[v.id] || (c.special.values[v.id] = [])).push(val);
                    c = c.parent;
                }
            }
            str += val;
            sval = val;
            if (typeof v === 'object' && 'text' in v)
                return `<span${styleClass(ctx, [], [styleFont(v.font, ctx) + styleExtra(v, ctx), ''])}>${val}</span>`;
            else
                return val;
        }).join('');
        if (w.id) {
            let c = ctx.context;
            while (c) {
                if (c.special && c.special.values)
                    (c.special.values[w.id] || (c.special.values[w.id] = [])).push(str);
                c = c.parent;
            }
        }
        if (w.format && w.format.name) {
            const args = [{ v: !Array.isArray(w.text) || w.text.length === 1 ? sval : val }, { v: w.format.name }];
            val = evaluate(ctx, { op: 'format', args: args.concat(w.format.args || []) });
        }
        return `<span${styleClass(ctx, ['label'], style(w, placement, ctx, { lineSize: true }))}>${escapeHTML(val)}</span>`;
    });
    registerRenderer('container', (w, ctx, placement, state) => {
        addStyle(ctx, 'container', `.container {position:absolute;box-sizing:border-box;}`);
        let h;
        if (!w.height)
            w.height = 'auto';
        else if (w.height !== 'auto')
            h = getHeightWithMargin(w, placement, ctx);
        const wctx = w.context ? extend(ctx, { value: evaluate(ctx, w.context) }) : ctx;
        const cw = getWidth(w, placement, ctx) || placement.availableX;
        const r = renderWidgets(w, wctx, { x: 0, y: 0, availableX: cw, availableY: h || placement.availableY, maxX: cw, maxY: h != null ? h : placement.maxY }, state, w.layout);
        if (!r.cancel) {
            r.output = `<div${styleClass(ctx, ['container'], style(w, placement, ctx, { computedHeight: h || r.height, container: true }))}>${r.output}</div>`;
            r.height = h || r.height;
            r.width = getWidthWithMargin(w, placement, ctx);
        }
        if ((r.cancel || r.continue) && !w.bridge) {
            const state = r.continue || {};
            state.offset = 0;
            // must start over
            delete state.last;
            return { continue: state, output: '' };
        }
        else if (r.continue)
            r.continue.offset = 0;
        return r;
    }, { container: true });
    registerRenderer('repeater', (w, ctx, placement, state) => {
        addStyle(ctx, 'container', `.container {position:absolute;box-sizing:border-box;}`);
        if (!w.height)
            w.height = 'auto';
        let availableY = placement.availableY;
        let availableX = placement.availableX;
        let r;
        let html = '';
        let commit = false;
        const m = expandMargin(w, ctx, placement);
        let y = !state || !state.state || state.state.part === 'header' ? m[0] : 0;
        availableY -= y;
        let group;
        let groupNo = false;
        let src = state && state.state && state.state.src;
        if (!src) {
            if (!w.source)
                return '';
            src = isValueOrExpr(w.source) ?
                evaluate(ctx, w.source) :
                filter(ctx.context.root.sources[w.source.source] || { value: [] }, w.source.filter, w.source.sort, w.source.group, ctx.context).value;
            (ctx.context.special || (ctx.context.special = {})).values || (ctx.context.special.values = {});
        }
        let arr;
        if (!Array.isArray(src)) {
            if (!src || !Array.isArray(src.value))
                return { output: '', height: 0 };
            group = src;
            arr = group.value;
            if (w.group) {
                groupNo = w.group.length > group.grouped ? w.group.length - group.grouped - 1 : false;
            }
        }
        else {
            arr = src;
        }
        if (group && (!state || !state.state || state.state.part === 'group')) {
            if (groupNo !== false)
                r = renderWidget(w.group[groupNo], extend(ctx, { value: group, special: { source: group && group.grouped ? group.all : arr, level: group && group.level, grouped: true, group: group.group } }), { x: 0, y, availableX: placement.availableX, maxX: placement.maxX, maxY: placement.maxY });
            if (r) {
                if (r.height > availableY)
                    return { output: '', height: 0, continue: { offset: 0, state: { part: 'group', src, current: 0 } } };
                else
                    availableY -= r.height;
                html += r.output;
                y += r.height;
            }
        }
        if (w.header && ((state && state.state && state.state.part === 'body' && w.headerPerPage !== false && (!group || !group.grouped)) || (!group || !group.grouped) && (!state || !state.state || state.state.part === 'header' || state.state.part === 'group'))) {
            r = renderWidget(w.header, ctx, { x: 0, y, availableX: placement.availableX, maxX: placement.maxX, maxY: placement.maxY });
            if (r.height > availableY)
                return { output: '', height: 0, continue: { offset: 0, state: { part: 'header', src, current: 0 } } };
            else
                availableY -= r.height;
            html += r.output;
            y += r.height;
        }
        let rctx = state && state.state && state.state.context || extend(ctx, { special: { source: group && group.grouped ? group.all : arr, level: group && group.level, grouped: groupNo !== false, group: group && group.group, values: {}, last: arr.length - 1, count: arr.length } });
        if (!state || !state.state || state.state.part !== 'footer') {
            let usedX = 0;
            let usedY = 0;
            let initY = y;
            for (let i = (state && state.state && state.state.current) || 0; i < arr.length; i++) {
                const c = group && group.grouped ?
                    extend(rctx, { value: arr[i], special: { index: i, values: {} } }) :
                    extend(rctx, { value: arr[i], special: { index: i } });
                if (group && group.grouped) {
                    const s = (state && state.child) || { offset: 0, state: { current: 0, src: arr[i], part: 'group' } };
                    r = renderWidget(w, c, { x: 0, y, availableX: availableX - usedX, availableY, maxX: placement.maxX, maxY: placement.maxY }, s);
                }
                else
                    r = renderWidget(w.row, c, { x: usedX, y, availableX: availableX - usedX, maxX: placement.maxX, availableY, maxY: placement.maxY }, state ? state.child : undefined);
                if (state)
                    state.child = null;
                if (r.width && r.width <= availableX - usedX && r.width !== availableX) {
                    usedX += r.width;
                    if (r.height > usedY)
                        usedY = r.height;
                }
                else if (r.width && usedX && r.width > availableX - usedX) {
                    y += usedY;
                    initY = y;
                    availableY -= usedY;
                    usedY = 0;
                    usedX = 0;
                    i--;
                    continue;
                }
                if (r.height > availableY || r.cancel) {
                    if (initY === y && usedY)
                        y += usedY;
                    if (commit)
                        return { output: `<div${styleClass(ctx, ['container', 'repeat'], style(w, placement, ctx, { computedHeight: y, container: true }))}>\n${html}</div>`, height: y, continue: { offset: y, state: { part: 'body', src, current: i, context: rctx }, child: r.continue } };
                    else
                        return { output: '', height: y, continue: { offset: y, state: { part: state && state.state && state.state.part || 'body', src, current: i, context: rctx }, child: r.continue } };
                }
                if (!usedY) {
                    y += r.height;
                    availableY -= r.height;
                }
                html += r.output;
                commit = true;
                if (r.continue) {
                    if (initY === y && usedY)
                        y += usedY;
                    return { output: `<div${styleClass(ctx, ['container', 'repeat'], style(w, placement, ctx, { computedHeight: y, container: true }))}>\n${html}</div>`, height: y, continue: { offset: y, state: { part: 'body', src, current: i, context: rctx }, child: r.continue } };
                }
            }
            if (initY === y && usedY)
                y += usedY;
        }
        if (w.footer) {
            const fctx = (rctx && rctx.context) || (state && state.state && state.state.context && state.state.context.context);
            const c = extend(ctx, { special: { source: group && group.grouped ? group.all : arr, level: group && group.level, grouped: groupNo !== false, group: group && group.group, values: (fctx && fctx.special || {}).values } });
            if (group) {
                if (w.groupEnds && w.groupEnds[group.grouped])
                    r = renderWidget(w.footer, c, { x: 0, y, availableX: placement.availableX, maxX: placement.maxX, maxY: placement.maxY });
                else
                    r = { output: '', height: 0 };
            }
            else
                r = renderWidget(w.footer, c, { x: 0, y, availableX: placement.availableX, maxX: placement.maxX, maxY: placement.maxY });
            if (r.height > availableY)
                return { output: `<div${styleClass(ctx, ['container', 'repeat'], style(w, placement, ctx, { computedHeight: y, container: true }))}>\n${html}</div>`, height: y, continue: { offset: y, state: { part: 'footer', src, current: 0, context: rctx } } };
            html += r.output;
            y += r.height;
        }
        return { output: `<div${styleClass(ctx, ['container', 'repeat'], style(w, placement, ctx, { computedHeight: y, container: true }))}>\n${html}</div>`, height: y };
    }, { container: true });
    registerRenderer('image', (w, ctx, placement) => {
        addStyle(ctx, 'image', `.image {position:absolute;box-sizing:border-box;} .image .inner {background-repeat:no-repeat;height:100%;}`);
        const fit = w.fit && typeof w.fit === 'object' ? evaluate(ctx, w.fit.x) : w.fit;
        if (fit === 'stretch') {
            return `<img src="${evaluate(ctx, w.url)}" ${styleClass(ctx, ['image'], style(w, placement, ctx))} />`;
        }
        else {
            return `<div ${styleClass(ctx, ['image'], style(w, placement, ctx))}><div ${styleClass(ctx, ['inner'], styleImage(fit), `background-image:url('${evaluate(ctx, w.url)}');`)}></div></div>`;
        }
    });
    registerRenderer('measured', (w, ctx, placement, state) => {
        addStyle(ctx, 'measured', `.measured {position:absolute;box-sizing:border-box;white-space:pre-wrap;word-break:break-all;font-family:serif;font-size:0.83rem}`);
        const text = evaluate(ctx, w.text);
        const height = measure(text, getWidth(w, placement, ctx) || placement.availableX, ctx, w.font);
        if (!state && height > placement.availableY) {
            return { output: '', height: 0, continue: { state: {}, offset: 0 } };
        }
        else {
            let s = style(w, placement, ctx, { computedHeight: height, container: true });
            s[0] = `line-height:1em;` + s[0];
            return {
                height, output: `<span${styleClass(ctx, ['measured', 'label'], s)}>${escapeHTML(text)}</span>`
            };
        }
    });
    registerRenderer('html', (w, ctx, placement) => {
        addStyle(ctx, 'html', `.html {position:absolute;box-sizing:border-box;overflow:hidden;line-height:1rem;}`);
        const html = evaluate(extend(ctx, { parser: parse$1 }), w.html);
        return `<div${styleClass(ctx, ['html'], style(w, placement, ctx, { container: true }))}>${html}</div>`;
    });

    const decRE = /(\d)(?=(\d{3})+\.)/g;
    const intRE = /(\d)(?=(\d{3})+$)/g;
    const isNumRE = /^[-0-9\\.,]+$/;
    function number(v, dec = 2, group = ',', negative = 'sign') {
        v = typeof v !== 'number' ? parseFloat(v || '') : v;
        if (isNaN(v))
            return '';
        const neg = v < 0;
        v = v.toFixed(dec);
        if (dec === 0)
            v = v.replace(/\..*/, '');
        if (neg && negative !== 'sign')
            v = `(${negative === 'both' ? v : v.substr(1)})`;
        if (group)
            return v.replace(v.indexOf('.') === -1 ? intRE : decRE, `$1${group}`);
        else
            return v;
    }
    function dollar(v, alt, dec = 2, group = ',', sign = '$', negative = 'sign') {
        if (v != null && isNumRE.test(v)) {
            if (!isNaN(+v))
                return `${sign}${number(v, dec, group, negative)}`;
            else
                return alt !== undefined ? alt : v;
        }
        else {
            return alt !== undefined ? alt : v;
        }
    }
    function phone(v) {
        if (typeof v === 'number')
            v = v.toString();
        v = v || '';
        v = v.replace(/[^\d]/g, '');
        if (v.length === 7)
            return `${v.substr(0, 3)}-${v.substr(3, 4)}`;
        else if (v.length === 10)
            return `(${v.substr(0, 3)}) ${v.substr(3, 3)}-${v.substr(6, 4)}`;
        else if (v.length === 11)
            return `${v[0]}-${v.substr(1, 3)}-${v.substr(4, 3)}-${v.substr(7, 4)}`;
        else
            return v;
    }
    const dateRE = /y+|M+|d+|E+|H+|m+|s+|k+|h+|a+|S+|z+/g;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dateDefault;
    function date$1(d, fmt) {
        if (!d)
            return '';
        let Y, M, D, DD, H, MM, S, SS, Z;
        // convert an exact range to numbers
        if (typeof d === 'object' && 'f' in d && Array.isArray(d.f)) {
            const f = d.f, l = f.length, e = d.e;
            Y = f[0], M = l > 1 && f[1] != null ? f[1] : e ? 11 : 0, D = l > 2 && f[2] != null ? f[2] : e ? 0 : 1,
                H = l > 3 && f[3] != null ? f[3] : e ? 23 : 0, MM = l > 4 && f[4] != null ? f[4] : e ? 59 : 0, S = l > 5 && f[5] != null ? f[5] : e ? 59 : 0,
                SS = l > 6 && f[6] != null ? f[6] : e ? 999 : 0;
            let dt = new Date(Y, M, D || 1, H, MM, S, SS);
            Z = l > 7 && f[7] != null ? -f[7] : dt.getTimezoneOffset();
            if (!D) {
                dt.setMonth(M + 1);
                dt.setDate(0);
                D = dt.getDate();
            }
            DD = dt.getDay();
        }
        else {
            if (typeof d === 'string')
                d = new Date(d);
            if (Object.prototype.toString.call(d) !== '[object Date]')
                return '';
            if (isNaN(d))
                return '';
            const v = d;
            Y = v.getFullYear(), M = v.getMonth(), D = v.getDate(), DD = v.getDay(), H = v.getHours(), MM = v.getMinutes(), S = v.getSeconds(), SS = v.getMilliseconds(), Z = v.getTimezoneOffset();
        }
        if (!fmt)
            fmt = dateDefault || 'yyyy-MM-dd';
        return fmt.replace(dateRE, m => {
            if (m[0] === 'y') {
                return m.length <= 2 ? (`${Y}`).substr(2, 2) : `${Y}`;
            }
            else if (m[0] === 'M') {
                if (m.length === 1)
                    return `${M + 1}`;
                else if (m.length === 2)
                    return M < 9 ? `0${M + 1}` : `${M + 1}`;
                else if (m.length === 3)
                    return months[M].substr(0, 3);
                else
                    return months[M];
            }
            else if (m[0] === 'd') {
                if (m.length === 1)
                    return `${D}`;
                else if (m.length === 2)
                    return D <= 9 ? `0${D}` : `${D}`;
                else
                    return ordinal(D);
            }
            else if (m[0] === 'E') {
                if (m.length === 1)
                    return `${DD + 1}`;
                else if (m.length === 2)
                    return days[DD].substr(0, 3);
                else
                    return days[DD];
            }
            else if (m[0] === 'H') {
                return m.length === 1 ? `${H}` : H <= 9 ? `0${H}` : `${H}`;
            }
            else if (m[0] === 'm') {
                return m.length === 1 ? `${MM}` : MM <= 9 ? `0${MM}` : `${MM}`;
            }
            else if (m[0] === 's') {
                return m.length === 1 ? `${S}` : S <= 9 ? `0${S}` : `${S}`;
            }
            else if (m[0] === 'S') {
                const ms = SS;
                if (m.length === 1)
                    return `${ms}`;
                return ms < 10 ? `00${ms}` : ms < 100 ? `0${ms}` : `${ms}`;
            }
            else if (m[0] === 'k' || m[0] === 'h') {
                let r = `${H % 12}`;
                if (r === '0')
                    r = '12';
                return `${r}`;
            }
            else if (m[0] === 'a') {
                return H > 11 ? 'PM' : 'AM';
            }
            else if (m[0] === 'z') {
                let min = 0 - Z;
                const bit = min < 0 ? '-' : '+';
                min = Math.abs(min);
                let r = min;
                if (m.length === 1) {
                    r = Math.floor(min / 60);
                }
                else if (m.length === 2) {
                    const mm = min % 60;
                    const h = Math.floor(min / 60);
                    return `${bit}${h < 10 ? '0' : ''}${h}${mm < 10 ? '0' : ''}${mm}`;
                }
                else if (m.length === 3) {
                    const mm = min % 60;
                    const h = Math.floor(min / 60);
                    return `${bit}${h < 10 ? '0' : ''}${h}:${mm < 10 ? '0' : ''}${mm}`;
                }
                else
                    r = min;
                return `${bit}${r}`;
            }
        });
    }
    date$1.setDefault = function (format) {
        dateDefault = format;
    };
    function ordinal(num, group) {
        num = number(num, 0, group);
        let n = `${num}`;
        n = n.substr(-2, 2);
        if (n.length > 1 && n[0] === '1')
            return `${num}th`;
        switch (n[1] || n[0]) {
            case '1':
                return `${num}st`;
            case '2':
                return `${num}nd`;
            case '3':
                return `${num}rd`;
            default:
                return `${num}th`;
        }
    }

    const checkIdent = new RegExp(`[${endRef.split('').map(v => `\\${v}`).join('')}]`);
    let _noSym = false;
    let _key = false;
    let _sexprops = false;
    let _listcommas = false;
    let _noarr = false;
    let _noobj = false;
    let _tpl = false;
    let _tplmode = false;
    let _noindent = false;
    let _listwrap = { array: 60, union: 60, args: 60, keys: 60 };
    let _html = false;
    let _nochecks = false;
    let _level = 0;
    let _first = false;
    const deepops = ['===', '!==', 'deep-is', 'deep-is-not'];
    const binops = deepops.concat(['**', '*', '/%', '/', '%', '+', '-', '>=', 'gte', '>', 'gt', '<=', 'lte', '<', 'lt', 'in', 'like', 'ilike', 'not-in', 'not-like', 'not-ilike', 'contains', 'does-not-contain', 'is', 'is-not', '==', '!=', 'strict-is', 'strict-is-not', 'and', '&&', 'or', '||', '??']);
    const unops = ['+', 'not'];
    const precedence = {
        '**': 1,
        '*': 2, '/%': 2, '/': 2, '%': 2,
        '+': 3, '-': 3,
        '>=': 4, '>': 4, '<=': 4, '<': 4, in: 4, like: 4, ilike: 4, 'not-in': 4, 'not-like': 4, 'not-ilike': 4, 'contains': 4, 'does-not-contain': 4, gt: 4, gte: 4, lt: 4, lte: 4,
        'is': 5, 'is-not': 5, '==': 5, '!=': 5, 'strict-is': 5, 'strict-is-not': 5, 'deep-is': 5, 'deep-is-not': 5, '===': 5, '!==': 5,
        'and': 6, '&&': 6,
        'or': 7, '||': 7, '??': 7,
    };
    const call_op = /^[-a-zA-Z_$0-9]/;
    function stringify(value, opts) {
        opts = opts || {};
        _noSym = opts.noSymbols;
        _sexprops = opts.SExprOps;
        _listcommas = opts.listCommas;
        _noarr = opts.SExprOps && opts.noArrayLiterals;
        _noobj = opts.SExprOps && opts.noObjectLiterals;
        _key = false;
        _tpl = _tplmode = opts.template;
        _noindent = opts.noIndent;
        _level = 0;
        _first = true;
        if ('listWrap' in opts) {
            const o = opts.listWrap;
            if (typeof o === 'boolean')
                _listwrap = !o ? { array: 0, union: 0, args: 0, keys: 0 } : { array: 1, union: 1, args: 1, keys: 1 };
            else if (typeof o === 'number')
                _listwrap = { array: o, union: o, args: o, keys: o };
            else {
                const b = !o.base ? 0 : o.base === true ? 1 : o.base;
                _listwrap = {
                    array: 'array' in o ? (!o.array ? 0 : o.array === true ? 1 : o.array) : b,
                    union: 'union' in o ? (!o.union ? 0 : o.union === true ? 1 : o.union) : b,
                    args: 'args' in o ? (!o.args ? 0 : o.args === true ? 1 : o.args) : b,
                    keys: 'keys' in o ? (!o.keys ? 0 : o.keys === true ? 1 : o.keys) : b,
                };
            }
        }
        else
            _listwrap = { array: 60, union: 60, args: 60, keys: 60 };
        _html = opts.htmlSafe;
        _nochecks = opts.noChecks;
        if (!_sexprops && typeof value === 'object' && value && 'op' in value && value.op === 'block')
            return stringifyRootBlock(value);
        else
            return _stringify(value);
    }
    function padl(v, pad, len) {
        v = `${v}`;
        if (!pad)
            return v;
        for (let i = v.length; i < len; i++) {
            v = pad + v;
        }
        return v;
    }
    function fill(char, len) {
        let res = '';
        for (let i = 0; i < len; i++)
            res += char;
        return res;
    }
    function _stringify(value) {
        if (value == null)
            return '';
        if (typeof value === 'string')
            return value;
        let stringed;
        if (_tpl && ('op' in value || 'r' in value)) {
            if ('op' in value) {
                if (value.op === 'if' || value.op === 'with' || value.op === 'unless' || value.op === 'each') {
                    stringed = stringifyTemplateBlock(value);
                }
                else if (value.op === 'case') {
                    stringed = stringifyTemplateCase(value);
                }
                else if (value.op) {
                    if (value.op === '+')
                        return value.args.map(a => _stringify(a)).join('');
                    else {
                        _tpl = false;
                        const res = `{{${_stringify(value.op === 'string' ? value.args[0] : value)}}}`;
                        _tpl = true;
                        stringed = res;
                    }
                }
            }
            else {
                _tpl = false;
                const res = `{{${_stringify(value)}}}`;
                _tpl = true;
                stringed = res;
            }
        }
        else if ('r' in value) {
            if (typeof value.r === 'string')
                stringed = /^[0-9]/.test(value.r) ? `.${value.r}` : value.r;
            else {
                const r = value.r;
                stringed = `${fill('^', r.u || 0)}${r.p || ''}${r.k.map((p, i) => {
                if (typeof p === 'string' && checkIdent.test(p))
                    return `${i ? '' : '_'}[${_stringify({ v: p })}]`;
                else if (typeof p === 'string' || typeof p === 'number')
                    return `${i ? '.' : ''}${p}`;
                else
                    return `[${_stringify(p)}]`;
            }).join('')}`;
            }
        }
        else if ('op' in value) {
            stringed = stringifyOp(value);
        }
        else if (isApplication(value)) {
            const arrow = ((_tplmode && _html !== false) || _html) ? '\\' : '>';
            if ('n' in value)
                stringed = `|${value.n.join(_listcommas ? ', ' : ' ')}| =${arrow} ${_stringify(value.a)}`;
            else
                stringed = `=${arrow}${_stringify(value.a)}`;
        }
        else if ('v' in value) {
            stringed = stringifyLiteral(value);
        }
        else if (isDateRel(value)) {
            stringed = stringifyDate(value);
        }
        else if (isTimespan(value)) {
            stringed = stringifyTimespan(value);
        }
        if ('c' in value && value.c.length)
            stringed = (_first ? '' : '\n') + value.c.map(c => `${padl('', '  ', _level)}// ${c}\n`).join('') + `${padl('', '  ', _level)}${stringed}`;
        return stringed;
    }
    function stringifyBinopArg(op, arg, pos) {
        let res;
        if (op === '**' && pos === 1 && typeof arg !== 'string' && 'op' in arg && arg.op === '**')
            res = `(${_stringify(arg)})`;
        if (typeof arg !== 'string' && 'op' in arg) {
            if (binops.includes(arg.op) && precedence[arg.op] > precedence[op])
                res = `(${_stringify(arg)})`;
            else if (arg.op === 'if' || arg.op === 'unless' || arg.op === 'case' || arg.op === 'fmt' || arg.op === 'format')
                res = `(${_stringify(arg)})`;
            else
                res = _stringify(arg);
        }
        else
            res = _stringify(arg);
        return res;
    }
    function findNestedStringOpL(op, value) {
        if (value.args && value.args.find(a => typeof a === 'object' && typeof a.v === 'string'))
            return true;
        if (!value.args || !value.args.length)
            return false;
        const left = value.args[0];
        if (typeof left === 'object' && 'op' in left && left.op === op)
            return findNestedStringOpL(op, left);
        return false;
    }
    function flattenNestedBinopsL(op, value, agg = []) {
        if (value.args && value.args.length) {
            let i = 0;
            for (; i < value.args.length; i++) {
                if (typeof value.args[i] === 'object' && typeof value.args[i].v === 'string')
                    agg.push(value.args[i]);
                else
                    break;
            }
            const left = value.args[i];
            if (typeof left === 'object' && 'op' in left && left.op === op)
                flattenNestedBinopsL(op, left, agg);
            else
                agg.push(left);
            agg.push.apply(agg, value.args.slice(i + 1));
        }
        return agg;
    }
    function stringifyOp(value) {
        let op = value.op;
        if ((_tplmode && _html !== false) || _html) {
            if (op === '>')
                op = 'gt';
            else if (op === '>=')
                op = 'gte';
            else if (op === '<')
                op = 'lt';
            else if (op === '<=')
                op = 'lte';
            else if (op === '&&')
                op = 'and';
        }
        if (!_noarr && op === 'array' && !value.opts) {
            return wrapArgs('[', value.args, value.opts, ']');
        }
        else if (!_noobj && op === 'object' && value.args && !value.args.find((a, i) => i % 2 === 0 && (typeof a === 'string' || !('v' in a) || typeof a.v !== 'string'))) {
            if (!value.args || !value.args.length)
                return '{}';
            return wrapArgs('{', value.args, value.opts, '}', 2);
        }
        else if (_sexprops) {
            if (!value.args || !value.args.length)
                return `(${op})`;
            return wrapArgs(`(${op} `, value.args, value.opts, ')', 0);
        }
        else if (op === 'if' || op === 'unless' && value.args && value.args.length > 2) {
            return stringifyIf(value);
        }
        else if (op === 'case' && value.args && value.args.length > 2) {
            return stringifyCase(value);
        }
        else if (op === '+' && value.args && value.args.length > 1 && findNestedStringOpL(op, value)) {
            const args = flattenNestedBinopsL(op, value);
            return `'${args.map(a => typeof a !== 'string' && 'v' in a && typeof a.v === 'string' ? a.v.replace(/[{']/g, v => `\\${v}`).replace(/\$$/, '\\$') : `{${_stringify(a)}}`).join('')}'`;
        }
        else if ((op === 'fmt' || op === 'format') && value.args && typeof value.args[1] === 'object' && 'v' in value.args[1] && typeof value.args[1].v === 'string') {
            const val = value.args[0];
            let vs = _stringify(val);
            if (typeof val !== 'string' && 'op' in val && (binops.includes(val.op) || unops.includes(val.op)))
                vs = `(${vs})`;
            if (value.opts)
                return `${vs}#${[value.args[1].v]}${wrapArgs('(', value.args.slice(2), value.opts, ')')}`;
            else
                return `${vs}#${[value.args[1].v].concat(value.args.slice(2).map(a => _stringify(a))).join(',')}`;
        }
        else if (binops.includes(op) && value.args && value.args.length > 1 && !value.opts && (!deepops.includes(op) || value.args.length === 2)) {
            let parts = value.args.map((a, i) => stringifyBinopArg(op, a, i === 0 ? 1 : 2));
            const long = parts.find(p => p.length > 30 || ~p.indexOf('\n')) || parts.reduce((a, c) => a + c.length, 0) && parts.length > 2;
            const split = _noindent ? ' ' : long ? `\n${padl('', '  ', _level + 1)}` : ' ';
            if (split.length > 1 || (!_noindent && long))
                parts = [parts[0]].concat(parts.slice(1).map(p => indentAll('  ', p)));
            return `${parts[0]} ${op}${split}${parts.slice(1).join(` ${op}${split.length > 1 ? `${split}` : split}`)}`;
        }
        else if (unops.includes(op) && value.args && value.args.length === 1) {
            const arg = value.args[0];
            if (typeof arg !== 'string' && 'op' in arg && (binops.includes(arg.op) || unops.includes(arg.op)))
                return `${op}(${_stringify(arg)})`;
            else
                return `${op}${call_op.test(op) ? ' ' : ''}${_stringify(arg)}`;
        }
        else if (op === 'block') {
            if (!value.args || !value.args.length)
                return '';
            _level++;
            const _f = _first;
            const parts = value.args.map((a, i) => (_first = i === 0, _stringify(a)));
            _first = _f;
            let split = _noindent ? '' : `\n${padl('', '  ', _level)}`;
            _level--;
            if (parts.length === 1 && !~parts[0].indexOf('\n'))
                return `{ ${parts[0]} }`;
            return `{${split}${parts.join(split)}\n${padl('', '  ', _level)}}`;
        }
        else if ((op === 'let' || op === 'set') && value.args && value.args.length === 2) {
            let path;
            let arg = value.args[0];
            if (typeof arg === 'string')
                path = arg;
            else if ('v' in arg && typeof arg.v === 'string')
                path = arg.v;
            else if ('v' in arg && typeof arg.v === 'object' && 'k' in arg.v)
                path = _stringify({ r: arg.v });
            else
                path = _stringify(arg);
            return `${op} ${path} = ${_stringify(value.args[1])}`;
        }
        else if (op === 'get' && value.args.length === 2 && typeof value.args[1] === 'object' && 'v' in value.args[1] && typeof value.args[1].v === 'object' && 'k' in value.args[1].v) {
            return `${_stringify(value.args[0])}${_stringify({ r: { k: ['r'].concat(value.args[1].v.k) } }).substr(1)}`;
        }
        else if (call_op.test(op)) {
            return wrapArgs(`${op}(`, value.args || [], value.opts, ')', 0);
        }
        else {
            if (!value.args || !value.args.length)
                return `(${op})`;
            return wrapArgs(`(${op} `, value.args, value.opts, ')', 0);
        }
    }
    function stringifyRootBlock(block) {
        if (!block.args || !block.args.length)
            return '';
        return block.args.map((a, i) => (_first = i === 0, _stringify(a))).join('\n');
    }
    function stringifyLiteral(value) {
        if (value.s === 1) {
            _level++;
            const res = stringifySchema(value.v);
            _level--;
            if (~res.indexOf('\n')) {
                const level = _noindent ? ' ' : `\n${padl('', '  ', _level)}`;
                return `@[${level}${level !== ' ' ? '  ' : ''}${res}${level}]`;
            }
            else
                return `@[${res}]`;
        }
        else if (typeof value.v === 'string') {
            if (_tpl)
                return value.v.replace(/\\(.)/g, '\\\\$1').replace(/{{/g, '\\{{');
            if ((_key || !_noSym) && !checkIdent.test(value.v) && value.v.length)
                return `${_key ? '' : ':'}${value.v}`;
            else if (!~value.v.indexOf("'"))
                return `'${value.v.replace(/[{']/g, v => `\\${v}`).replace(/\${/g, '\\${')}'`;
            else if (!~value.v.indexOf('`'))
                return `\`${value.v.replace(/[{`]/g, v => `\\${v}`).replace(/\${/g, '\\${')}\``;
            else if (!~value.v.indexOf('"'))
                return `"${value.v}"`;
            else
                return `'${value.v.replace(/['{]/g, s => `\\${s}`).replace(/\${/g, '\\${')}'`;
        }
        else if (typeof value.v === 'number' || typeof value.v === 'boolean' || value.v === 'true' || value.v === 'false') {
            return `${value.v}`;
        }
        else if (value.v === 'undefined' || value.v === undefined) {
            return 'undefined';
        }
        else if (value.v === 'null' || value.v === null) {
            return 'null';
        }
        else if (Array.isArray(value.v)) {
            if (_noarr)
                return `(array${value.v.length ? ' ' : ''}${value.v.map(v => _stringify({ v })).join(_listcommas ? ', ' : ' ')})`;
            return `[${value.v.map(v => _stringify({ v })).join(_listcommas ? ', ' : ' ')}]`;
        }
        else if (typeof value.v === 'object') {
            if (isDateRel(value.v)) {
                return stringifyDate(value.v);
            }
            else {
                const keys = Object.keys(value.v);
                let res = '';
                res += '{';
                res += `${keys.map(k => `${_key = true, _stringify({ v: k })}:${_key = false, _stringify({ v: value.v[k] })}`).join(_listcommas ? ', ' : ' ')}`;
                res += '}';
                return res;
            }
        }
    }
    function offsetToTimezone(dir, offset) {
        if (offset == null)
            return '';
        offset = offset * dir;
        const o = Math.abs(offset);
        const h = Math.floor(o / 60);
        const m = o % 60;
        if (!offset)
            return 'Z';
        else
            return `${offset > 0 ? '-' : '+'}${h}${m ? `:${padl(m, '0', 2)}` : ''}`;
    }
    const spanKeys = ['w', 'd', 'h', 'mm', 's'];
    const spanExact = ['y', 'm', 'd', 'h', 'mm', 's', 'ms'];
    function stringifyDate(value) {
        let str = '';
        if (value instanceof Date) { // date object
            const y = value.getFullYear();
            const m = value.getMonth() + 1;
            const d = value.getDate();
            const h = value.getHours();
            const mn = value.getMinutes();
            const s = value.getSeconds();
            const ms = value.getMilliseconds();
            str = `${y}-${padl(m, '0', 2)}-${padl(d, '0', 2)}`;
            if (h + mn + s + ms > 0) {
                str += ` ${padl(h, '0', 2)}:${padl(mn, '0', 2)}`;
                if (s + ms > 0) {
                    str += `:${padl(s, '0', 2)}`;
                    if (ms > 0)
                        str += `.${padl(ms, '0', 3)}`;
                }
            }
            return `#${str}${offsetToTimezone(1, value.getTimezoneOffset())}#`;
        }
        else if (Array.isArray(value.f)) { // precise date
            const a = value.f;
            str = `${a[0]}`;
            if (a[1] != null)
                str += `-${padl(a[1] + 1, '0', 2)}`;
            if (a[2] != null)
                str += `-${padl(a[2], '0', 2)}`;
            if (a[3] != null)
                str += ` ${padl(a[3], '0', 2)}`;
            if (a[4] != null)
                str += `:${padl(a[4], '0', 2)}`;
            if (a[5] != null)
                str += `:${padl(a[5], '0', 2)}`;
            if (a[6] != null)
                str += `.${padl(a[6], '0', 3)}`;
            if (a[7] != null)
                str += ` ${offsetToTimezone(-1, a[7])}`;
            if ('e' in value && value.e)
                str += '<';
            return `#${str}#`;
        }
        else if (value.f === 'n') { // relative point in time
            if (Array.isArray(value.o)) { // inconsistent units
                spanExact.forEach((k, i) => {
                    if (value.o[i] != null)
                        str += `${value.o[i]}${k}`;
                });
                str += `${'d' in value && value.d === -1 ? ' ago' : ' from now'}${offsetToTimezone(-1, value.z)}`;
                return `#${str}#`;
            }
            else if (typeof value.o === 'number') { // milliseconds
                if (value.o === 0)
                    return `#now#`;
                let rem = Math.abs(value.o);
                spanKeys.forEach(k => {
                    const t = Math.floor(rem / timespans[k]);
                    rem = rem % timespans[k];
                    if (t)
                        str += `${t}${k}`;
                });
                if (rem)
                    str += `${rem}ms`;
                return `#${str}${value.o < 0 ? ' ago' : value.o > 0 ? ' from now' : ''}${offsetToTimezone(-1, value.z)}#`;
            }
        }
        else if ('d' in value && value.d === 1 && value.o === 0) { // span to date
            str = `#${value.f === 'w' ? 'week' : value.f === 'm' ? 'month' : 'year'} to date${offsetToTimezone(-1, value.z)}${value.e && '>' || ''}#`;
        }
        else if ('t' in value && Array.isArray(value.t)) { // time on relative day
            const a = value.t;
            str = `${value.o < 0 ? 'yesterday' : value.o > 0 ? 'tomorrow' : 'today'} at `;
            if (!a[0] && !a[1] && !a[2] && !a[3])
                str += 'midnight';
            else if (a[0] === 12 && !a[1] && !a[2] && !a[3])
                str += 'noon';
            else {
                str += a[0];
                if (a[1] != null)
                    str += `:${padl(a[1], '0', 2)}`;
                if (a[2] != null)
                    str += `:${padl(a[2], '0', 2)}`;
                if (a[3] != null)
                    str += `.${padl(a[3], '0', 3)}`;
            }
            return `#${str}${offsetToTimezone(-1, a[4])}${value.e ? '>' : ''}#`;
        }
        else if (!('t' in value) && !('d' in value) && !Array.isArray(value.f)) { // relative span
            const v = value;
            if (v.f === 'd') {
                str += `${v.o < 0 ? 'yesterday' : v.o > 0 ? 'tomorrow' : 'today'}`;
            }
            else {
                str += `${v.o < 0 ? 'last' : v.o > 0 ? 'next' : 'this'} ${v.f === 'w' ? 'week' : v.f === 'm' ? 'month' : 'year'}`;
            }
            return `#${str}${offsetToTimezone(-1, v.z)}${v.e ? '>' : ''}#`;
        }
        return str;
    }
    function stringifyTimespan(value) {
        if (typeof value === 'number' || isTimespanMS(value)) {
            let str = '';
            let rem = Math.abs(timeSpanToNumber(value));
            spanKeys.forEach(k => {
                const t = Math.floor(rem / timespans[k]);
                rem = rem % timespans[k];
                if (t)
                    str += `${t}${k}`;
            });
            if (rem)
                str += `${rem}ms`;
            return `#${str}#`;
        }
        else {
            const o = value.d;
            let str = '';
            spanExact.forEach((k, i) => {
                if (o[i] != null)
                    str += `${o[i]}${k}`;
            });
            return `#${str}#`;
        }
    }
    const leadingSpace = /^\s+/;
    const allLeadingSpace = /^\s+/gm;
    function outdentAll(amount, str) {
        if (amount)
            return str.replace(allLeadingSpace, s => s.substr(amount.length));
        else
            return str;
    }
    function indentAll(amount, str) {
        return str.replace(/\n/gm, `\n${amount}`);
    }
    function wrapArgs(open, args, opts, close, keyMod, call) {
        if ((!args || !args.length) && !opts)
            return `${open}${close}`;
        _level++;
        const _f = _first;
        let parts;
        if (keyMod) {
            parts = [];
            for (let i = 0; i < args.length; i++) {
                if (i % keyMod === 0) {
                    _key = true;
                    parts.push(_stringify(args[i]) + ':');
                    _key = false;
                }
                else {
                    _level++;
                    _first = i === 1;
                    const res = _stringify(args[i]);
                    if (res[0] === '\n')
                        parts[parts.length - 1] += ' ' + res.replace(leadingSpace, '');
                    else
                        parts[parts.length - 1] += res;
                    _level--;
                }
            }
        }
        else {
            parts = args.map((a, i) => {
                _first = i === 0;
                return _stringify(a);
            });
        }
        if (opts && typeof opts === 'object') {
            const args = 'op' in opts && opts.args ? opts.args : 'v' in opts ? Object.entries(opts.v).reduce((a, c) => (a.push({ v: c[0] }, { v: c[1] }), a), []) : [];
            for (let i = 0; i < args.length; i++) {
                if (i % 2 === 0) {
                    _key = true;
                    parts.push(_stringify(args[i]) + ':');
                    _key = false;
                }
                else {
                    _level++;
                    _first = i === 1;
                    const res = _stringify(args[i]);
                    if (res[0] === '\n')
                        parts[parts.length - 1] += ' ' + res.replace(leadingSpace, '');
                    else
                        parts[parts.length - 1] += res;
                    _level--;
                }
            }
        }
        _level--;
        _first = _f;
        let join = _listcommas ? ', ' : ' ';
        if (_noindent || (parts.length == 1 && !~parts[0].indexOf('\n')))
            return `${open}${parts.join(join)}${close}`;
        let wrap = _listwrap.args;
        const base = parts.join(_listcommas ? ', ' : ' ');
        if (!wrap && ~base.indexOf('\n'))
            wrap = 1;
        if (wrap === 1 && _listcommas)
            join = ',\n';
        const level = padl('', '  ', _level);
        if (!wrap)
            return `${open}${base}${close}`;
        else if (wrap === 1)
            return `${open}\n${parts.map(p => `${level}  ${p}`).join(join)}\n${level}${close}`;
        if (base.length <= wrap)
            return `${open}${base}${close}`;
        let res = `${open}`;
        let str = '';
        const last = parts.length - 1;
        for (let i = 0; i < parts.length; i++) {
            if (~parts[i].indexOf('\n')) {
                if (str)
                    res += str;
                res += `\n${parts[i][0] === ' ' ? '' : level + '  '}${parts[i]}${i !== last ? join : ''}`;
                str = '';
                continue;
            }
            if (!str)
                str += `\n${level}  `;
            str += `${parts[i]}${i !== last ? join : ''}`;
            if (str.length >= wrap) {
                res += str;
                str = '';
            }
        }
        if (str)
            res += str;
        return `${res}\n${level}${close}`;
    }
    function isBlock(v) {
        return typeof v === 'object' && 'op' in v && v.op === 'block';
    }
    function stringifyIf(op) {
        if (!op.args || op.args.length < 2)
            return 'false';
        let str = '';
        const last = op.args.length - 1;
        const block = !!op.args.find((p, i) => (i % 2 === 1 || i === last) && isBlock(p));
        _level++;
        const parts = op.args.map((a, i) => _stringify(block && (i % 2 === 1 || i === last) && !isBlock(a) ? { op: 'block', args: [a] } : a));
        _level--;
        const long = parts.find(p => p.length > 30 || ~p.indexOf('\n')) || '';
        let split = _noindent ? '' : parts.length > 3 || long ? `\n${padl('', '  ', _level)}` : '';
        const cindent = long && `${split}  ` || ' ';
        split = split || ' ';
        for (let i = 0; i <= last; i++) {
            if (i === 0) {
                if (block)
                    str += `if ${parts[i++]} ${outdentAll('  ', parts[i]).trimLeft()}`;
                else {
                    const cond = parts[i++];
                    str += `if ${cond}${~cond.indexOf('\n') ? split : ' '}then${cindent}${parts[i].trimLeft()}`;
                }
            }
            else if (i === last) {
                if (block)
                    str = str.trimRight() + ` else ${outdentAll('  ', parts[i]).trimLeft()}`;
                else
                    str += `${split}else${cindent}${parts[i].trimLeft()}`;
            }
            else {
                if (block)
                    str = str.trimRight() + ` elif ${parts[i++]} ${outdentAll('  ', parts[i]).trimLeft()}`;
                else
                    str += `${split}elif ${parts[i++]} then${cindent}${parts[i].trimLeft()}`;
            }
        }
        if (!block && _level)
            str += `${split}end`;
        return str;
    }
    const caseRE = /@case\b/g;
    function stringifyCase(op) {
        if (!op.args || op.args.length < 2)
            return 'false';
        let str = '';
        const last = op.args.length - 1;
        const block = !!op.args.find((p, i) => ((i > 1 && i % 2 === 0) || i === last) && isBlock(p));
        _level++;
        const parts = op.args.map((a, i) => {
            let res;
            if (i !== 0)
                _level++;
            if (block && (i > 1 && i % 2 === 0 || i === last)) {
                res = _stringify(isBlock(a) ? a : { op: 'block', args: [a] });
            }
            else if (i % 2 === 0 || i === last) {
                res = _stringify(a);
            }
            else {
                res = typeof a === 'object' && 'op' in a ? _stringify(a).replace(caseRE, '_') : _stringify(a);
            }
            if (i !== 0)
                _level--;
            return res;
        });
        _level--;
        const long = parts.find(p => p.length > 30 || ~p.indexOf('\n')) || '';
        let split = _noindent ? '' : parts.length > 3 || long ? `\n${padl('', '  ', _level)}` : '';
        const wsplit = split ? `${split}  ` : ' ';
        const cindent = long && `${wsplit}  ` || ' ';
        split = split || ' ';
        for (let i = 0; i <= last; i++) {
            if (i === 0) {
                if (block)
                    str += `case ${parts[i]}`;
                else
                    str += `case ${parts[i]}`;
            }
            else if (i === last) {
                if (block)
                    str = str.trimRight() + wsplit + `else ${outdentAll('  ', parts[i]).trimLeft()}`;
                else
                    str += `${wsplit}else${cindent}${parts[i].trimLeft()}`;
            }
            else {
                if (block)
                    str = str.trimRight() + wsplit + `when ${parts[i++]} ${outdentAll('  ', parts[i]).trimLeft()}`;
                else {
                    const cond = parts[i++];
                    str += `${wsplit}when ${cond}${~cond.indexOf('\n') ? wsplit : ' '}then${cindent}${parts[i].trimLeft()}`;
                }
            }
        }
        if (!block && _level)
            str += `${split}end`;
        return str;
    }
    function stringifyTemplateBlock(op) {
        _tpl = false;
        const cond = _stringify(op.args[0]);
        _tpl = true;
        const first = _stringify(op.args[1]);
        let res = `{{${op.op} ${cond}}}${op.op === 'with' || op.op === 'each' ? first.slice(2) : first}`;
        if (op.op === 'unless')
            return `${res}{{/}}`;
        for (let i = 2; i < op.args.length; i++) {
            if (i + 1 >= op.args.length) {
                const arg = op.args[i];
                if (typeof arg === 'object' && 'v' in arg && arg.v === '')
                    continue;
                else
                    res += `{{else}}${_stringify(arg)}`;
            }
            else {
                _tpl = false;
                res += `{{elseif ${_stringify(op.args[i++])}}}`;
                _tpl = true;
                res += _stringify(op.args[i]);
            }
        }
        res += '{{/}}';
        return res;
    }
    function stringifyTemplateCase(op) {
        const last = op.args.length - 1;
        const parts = op.args.map((a, i) => {
            _tpl = true;
            if (i === 0 || i % 2 === 1)
                _tpl = false;
            if (i === last)
                _tpl = true;
            return typeof a === 'object' && 'op' in a ? _stringify(a).replace(caseRE, '_') : _stringify(a);
        });
        _tpl = true;
        let res = `{{${op.op} ${parts[0]} when ${parts[1]}}}`;
        for (let i = 2; i <= last; i++) {
            if (i === last)
                res += `{{else}}${parts[i]}`;
            else if (i % 2 === 1)
                res += `{{when ${parts[i]}}}`;
            else
                res += parts[i];
        }
        res += '{{/}}';
        return res;
    }
    function stringifySchema(schema, noChecks) {
        if (noChecks !== undefined)
            _nochecks = noChecks;
        if (!schema)
            return 'any';
        const t = schema.type;
        const ts = schema.types;
        let strs;
        let fin = '', open = '', close = '', join = '';
        let wrap = _listwrap.array;
        switch (t) {
            case 'object':
            case 'object[]':
                const arr = !!~t.indexOf('[]');
                if ((!schema.fields || !schema.fields.length) && !schema.rest) {
                    fin = `{}${arr ? '[]' : ''}`;
                    break;
                }
                wrap = _listwrap.keys;
                _level++;
                strs = schema.fields ? schema.fields.map((f, i) => {
                    const str = stringifySchema(f);
                    return (f.desc && f.desc.length ? (i === 0 ? '' : `\n${padl('', '  ', _level)}`) + f.desc.map(c => `// ${c}`).join(`\n${padl('', '  ', _level)}`) + `\n${padl('', '  ', _level)}` : '') + `${f.name}${f.required ? '' : '?'}: ${str}`;
                }) : [];
                if (schema.rest)
                    strs.push(`...: ${stringifySchema(schema.rest)}`);
                _level--;
                open = '{';
                close = `}${arr ? '[]' : ''}`;
                join = ', ';
                break;
            case 'union':
            case 'union[]':
                if (~t.indexOf('[]'))
                    open = 'Array<', close = '>';
                else if (schema.checks && schema.checks.length)
                    open = '(', close = ')';
                if (open)
                    _level++;
                strs = ts.map(u => stringifySchema(u));
                wrap = _listwrap.union;
                join = strs.length > 6 || strs.find(s => ~s.indexOf('\n')) ? ' | ' : '|';
                if (open)
                    _level--;
                break;
            case 'literal':
                if (typeof schema.literal === 'string')
                    fin = `'${schema.literal.replace(/'/g, '\\\'')}'`;
                else
                    fin = `${schema.literal}`;
                break;
            case 'tuple':
            case 'tuple[]':
                if (!t || t.length === 0) {
                    fin = '[]';
                    break;
                }
                _level++;
                open = '[', close = `]${~t.indexOf('\n') ? '[]' : ''}`;
                join = ', ';
                strs = ts.map(t => stringifySchema(t));
                _level--;
                break;
            default:
                fin = schema.ref || t || 'any';
                if (schema.ref && t === 'array')
                    fin += '[]';
                break;
        }
        let defs;
        const level = _noindent ? ' ' : padl('', '  ', _level);
        if (schema.defs) {
            const keys = Object.keys(schema.defs).sort();
            defs = keys.map((k, i) => {
                const def = schema.defs[k];
                return (def.desc && def.desc.length ? (i === 0 ? '' : `\n${level}`) + def.desc.map(c => `// ${c}`).join(`\n${level}`) + `\n${level}` : '') + `type ${k} = ${stringifySchema(def)}`;
            }).join(`\n${level}`);
        }
        if (!fin) {
            const l2 = open && !_noindent ? `${level}  ` : level;
            const nl = _noindent ? '' : '\n';
            const lopen = open ? `${open}${nl}${l2}` : '';
            const lclose = close ? `${nl}${level}${close}` : '';
            if (wrap === 0)
                fin = `${lopen}${strs.join(join)}${lclose}`;
            else if (wrap === 1)
                fin = `${lopen}${strs.join(`${join}${nl}${l2}`)}${lclose}`;
            else {
                let line = '';
                const last = strs.length - 1;
                for (let i = 0; i < strs.length; i++) {
                    if (~strs[i].indexOf('\n')) {
                        line = '';
                        fin += (i === 0 ? '' : '\n' + l2) + strs[i] + (i !== last ? join : '');
                    }
                    else {
                        fin += strs[i], line += strs[i];
                        if (i !== last)
                            fin += join, line += join;
                    }
                    if (line.length > wrap && i !== last && !~(strs[i + 1] || '').indexOf('\n')) {
                        fin += `${nl}${l2}`;
                        line = '';
                        if (~join.indexOf('|'))
                            fin += '  ';
                    }
                }
                if (~fin.indexOf('\n'))
                    fin = `${lopen}${fin}${lclose}`;
                else
                    fin = `${open}${open === '{' ? ' ' : ''}${fin}${open === '{' && fin.substr(-1) !== ' ' ? ' ' : ''}${close}`;
            }
        }
        if (!_nochecks && schema.checks && schema.checks.length) {
            fin += ` ?${schema.checks.map(c => _stringify(c)).join(' ?')} `;
        }
        if (defs)
            fin = `${defs}\n${level}\n${level}${fin}`;
        return fin;
    }

    const parseSchema = parser(map(seq(opt(str('@[')), ws, schema(), ws, opt(str(']'))), ([, , schema]) => schema), { trim: true, consumeAll: true });

    const space$1 = ' \t\r\n';
    const num$2 = map(seq(opt(str('-')), read1(digits)), ([neg, num]) => neg ? -num : +num);
    const num_range = map(seq(num$2, str('-', ':'), num$2), ([start, , end]) => [start, end]);
    const sign_range = map(seq(str('<', '>'), ws, num$2), ([sign, , num]) => sign === '<' ? [-Infinity, num - 1] : [num + 1, Infinity]);
    const star_range = map(str('*'), () => [-Infinity, Infinity]);
    const _range = rep1sep(alt(star_range, num_range, sign_range, num$2), read1(space$1 + ',;'), 'allow');
    const range = parser(_range, { trim: true });

    function join(...strs) {
        return strs.filter(s => s).join('.');
    }
    const looseEqual = (v1, v2) => v1 == v2;
    const strictEqual = (v1, v2) => v1 === v2;
    const fullnum = /^\d+$/;
    function checkIdentity(map, path) {
        const p = path.split('.').reduce((a, c) => fullnum.test(c) ? `${a}[]` : `${a}${a.length ? '.' : ''}${c}`, '');
        return map[`${p}[]`];
    }
    function diff(v1, v2, equal) {
        const type = equal && typeof equal === 'object' ? equal.type : equal;
        const eq = typeof type === 'function' ? type : type === 'strict' ? strictEqual : looseEqual;
        return _diff(v1, v2, '', {}, eq, typeof equal === 'object' ? equal.identity : undefined);
    }
    function _diff(v1, v2, path, diff, equal, ident) {
        if (typeof v1 !== 'object' || typeof v2 !== 'object') {
            if (v1 === v2)
                return diff;
            diff[path] = [v1, v2];
            return diff;
        }
        let id;
        if (Array.isArray(v1) && Array.isArray(v2) && ident && (id = checkIdentity(ident, path))) {
            const v1ids = v1.map(v => id === true ? v : typeof id === 'string' ? (v && (typeof v === 'object' || typeof v === 'function') ? v[id] : v) : id(v));
            const v2ids = v2.map(v => id === true ? v : typeof id === 'string' ? (v && (typeof v === 'object' || typeof v === 'function') ? v[id] : v) : id(v));
            for (let i = 0; i < v1ids.length; i++) {
                const idx = v2ids.indexOf(v1ids[i]);
                if (~idx) {
                    const vv1 = v1[i];
                    const vv2 = v2[idx];
                    if (vv1 === vv2)
                        continue;
                    else if (typeof vv1 === 'object' && typeof vv2 === 'object')
                        _diff(vv1, vv2, join(path, `${i}`), diff, equal, ident);
                    else if (!equal(vv1, vv2))
                        diff[join(path, `${i}`)] = [vv1, vv2];
                }
                else
                    diff[join(path, `${i}`)] = [v1[i], undefined];
            }
            const found = v1ids.slice();
            for (let i = 0; i < v1ids.length; i++) {
                if (~found.indexOf(v2ids[i]))
                    continue;
                diff[join(path, `${i + found.length}`)] = [undefined, v2[i]];
            }
        }
        else {
            const _v1 = v1 || {};
            const _v2 = v2 || {};
            const ks = Object.keys(_v1);
            for (const k of Object.keys(_v2))
                if (!~ks.indexOf(k))
                    ks.push(k);
            for (const k of ks) {
                const vv1 = _v1[k];
                const vv2 = _v2[k];
                if (vv1 === vv2)
                    continue;
                else if (typeof vv1 === 'object' && typeof vv2 === 'object')
                    _diff(vv1, vv2, join(path, k), diff, equal, ident);
                else if (!equal(vv1, vv2))
                    diff[join(path, k)] = [vv1, vv2];
            }
        }
        return diff;
    }
    function deepEqual(v1, v2, equal) {
        const eq = typeof equal === 'function' ? equal : equal === 'strict' ? strictEqual : looseEqual;
        return _deepEqual(v1, v2, eq);
    }
    function _deepEqual(v1, v2, equal) {
        if (typeof v1 !== 'object' || typeof v2 !== 'object')
            return equal(v1, v2);
        const ks = Object.keys(v1 || {});
        for (const k of Object.keys(v2 || {}))
            if (!~ks.indexOf(k))
                ks.push(k);
        for (const k of ks) {
            const vv1 = v1[k];
            const vv2 = v2[k];
            if (vv1 === vv2)
                continue;
            else if (typeof vv1 === 'object' && typeof vv2 === 'object') {
                if (!_deepEqual(vv1, vv2, equal))
                    return false;
            }
            else if (!equal(vv1, vv2))
                return false;
        }
        return true;
    }
    function labelDiff(diff, label, opts) {
        const out = (opts === null || opts === void 0 ? void 0 : opts.omit) ? {} : Object.assign({}, diff);
        _labelDiff(diff, label, '', '', out, opts);
        return out;
    }
    const num$1 = /^\d+/;
    function _labelDiff(diff, label, path, str, out, opts) {
        for (const k in label) {
            if (k.slice(-2) === '[]') {
                const p = `${path}${path && '.'}${k.slice(0, -2)}`;
                const l = Array.isArray(label[k]) ? label[k] : [label[k]];
                const all = Object.keys(diff);
                const nums = [];
                for (const k of all) {
                    if (k.indexOf(p) === 0 && num$1.test(k.substr(p.length + 1))) {
                        const idx = k.indexOf('.', p.length + 1);
                        const num = k.substring(p.length + 1, ~idx ? idx : undefined);
                        if (!~nums.indexOf(num))
                            nums.push(num);
                    }
                }
                const lbl = `${str}${str && ' '}${l[0]}`;
                for (const num of nums) {
                    const pp = `${p}${p && '.'}${num}`;
                    if (pp in diff) {
                        out[`${lbl}${lbl && ' '}${+num + 1}`] = diff[pp];
                        if (opts === null || opts === void 0 ? void 0 : opts.omit)
                            delete out[pp];
                    }
                    if (l[1])
                        _labelDiff(diff, l[1], pp, `${lbl}${lbl && ' '}${+num + 1}`, out, opts);
                }
            }
            else {
                const p = `${path}${path && '.'}${k}`;
                let l = Array.isArray(label[k]) ? label[k] : [label[k]];
                const lbl = `${str}${str && ' '}${l[0]}`;
                if (p in diff) {
                    out[lbl] = diff[p];
                    if (opts === null || opts === void 0 ? void 0 : opts.omit)
                        delete out[p];
                }
                if (l[1])
                    _labelDiff(diff, l[1], p, lbl, out, opts);
            }
        }
    }

    const date = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    function isDate(v) {
        if (typeof v === 'object')
            return isDateRel(v);
        else if (typeof v === 'string' && date.test(v))
            return true;
        return false;
    }
    function inspect(base, flat) {
        const root = getType(base);
        if (Array.isArray(base)) {
            const fields = [];
            fields.push({ type: 'number', name: 'length' });
            if (!flat && base.length > 0) {
                const val = inspect(base[0]);
                if (val.fields)
                    fields.push({ type: val.type, fields: val.fields, name: '0' });
                else
                    fields.push({ type: val.type, name: '0' });
            }
            return { type: root, fields };
        }
        else if (typeof base === 'object' && !isDate(base)) {
            const fields = [];
            for (const k in base) {
                fields.push(getField(k, base[k], flat));
            }
            return { type: root, fields };
        }
        return { type: root };
    }
    function getField(name, v, flat) {
        const type = getType(v);
        if (!flat && (~type.indexOf('object') || type === 'array')) {
            const cs = inspect(v);
            if (cs.fields)
                return { type, fields: cs.fields, name };
            else
                return { type, name };
        }
        return { type: getType(v), name };
    }
    function getType(v) {
        if (typeof v === 'string') {
            if (isDate(v))
                return 'date';
            else
                return 'string';
        }
        else if (typeof v === 'number')
            return 'number';
        else if (typeof v === 'boolean')
            return 'boolean';
        else if (Array.isArray(v)) {
            if (v.length < 1)
                return 'array';
            else if (typeof v[0] === 'string') {
                if (isDate(v[0]))
                    return 'date[]';
                else
                    return 'string[]';
            }
            else if (typeof v[0] === 'number')
                return 'number[]';
            else if (typeof v[0] === 'boolean')
                return 'boolean[]';
            else if (isDate(v[0]))
                return 'date[]';
            else if (typeof v[0] === 'object')
                return 'object[]';
            else
                return 'array';
        }
        else if (typeof v === 'object') {
            if (isDate(v))
                return 'date';
            else
                return 'object';
        }
        else
            return 'any';
    }
    function validate(value, schema, mode) {
        if (typeof schema === 'string') {
            const parsed = parseSchema(schema);
            if ('message' in parsed)
                return [{ error: 'invalid schema' }];
            schema = parsed;
        }
        if (!schema)
            schema = { type: 'any' };
        const ctx = new Root(value, { special: { types: schema.defs || {} } });
        return _validate(value, schema, mode, '', ctx);
    }
    function _validate(value, schema, mode, path, ctx, required) {
        schema = schema || {};
        let _schema = schema;
        const errs = [];
        const miss = mode === 'strict' || mode === 'missing';
        if (_schema.ref) {
            let s = _schema;
            while (s && s.ref)
                s = safeGet(ctx, `@types.${s.ref}`);
            if (s)
                _schema = s;
            else if (miss)
                errs.push({ error: `missing type definition '${_schema.ref}'`, type: 'missing' });
        }
        let { checks } = _schema;
        const { type, fields, rest, types, literal } = _schema;
        if (!checkType(value, schema.type === 'array' ? 'array' : type, literal, required))
            return [{ error: `type mismatch for${required ? ' required' : ''} '${type}'`, actual: stringifySchema(inspect(value)), value, path, expected: stringifySchema(_schema, true) }];
        if (_schema !== schema && schema.checks) {
            if (!checks)
                checks = schema.checks;
            else
                checks = checks.concat(schema.checks);
        }
        let tmp;
        if ((type === 'tuple' || type === 'tuple[]') && types) {
            const arr = ~type.indexOf('[]');
            const val = arr ? value : [value];
            for (let i = 0; i < val.length; i++) {
                const v = val[i];
                const p = arr ? join(path, `${i}`) : path;
                if (!Array.isArray(v)) {
                    errs.push({ error: 'expected a tuple', path: p, value: v });
                }
                else if (v.length < types.length) {
                    const diff = types.length - v.length;
                    errs.push({ error: `missing ${diff} field${diff > 1 ? 's' : ''} in tuple`, path: p, expected: stringifySchema({ type: 'tuple', types }) });
                }
                else {
                    for (let i = 0; i < types.length; i++) {
                        if ((tmp = _validate(v[i], types[i], mode, join(p, `${i}`), extend$1(ctx, { value: v[i], path: join(p, `${i}`) }))) !== true)
                            errs.push.apply(errs, tmp);
                    }
                    if (mode === 'strict' && v.length > types.length)
                        errs.push({ error: `too many values for tuple`, type: 'strict', path: p, expected: stringifySchema({ type: 'tuple', types }) });
                }
            }
        }
        else if ((type === 'union' || type === 'union[]') && types) {
            const arr = ~type.indexOf('[]');
            const val = arr ? value : [value];
            for (let i = 0; i < val.length; i++) {
                const v = val[i];
                const p = arr ? join(path, `${i}`) : path;
                let ok = false;
                let legit;
                for (const u of types) {
                    if ((tmp = _validate(v, u, mode, p, ctx)) === true) {
                        ok = true;
                        break;
                    }
                    else if (miss && tmp.find(e => e.type === 'missing') || tmp.find(e => e.type === 'check')) {
                        legit = tmp.filter(e => miss && e.type === 'missing' || e.type === 'check');
                    }
                    else if (tmp.find(e => e.path !== p)) {
                        legit = tmp;
                    }
                }
                if (!ok && !legit)
                    errs.push({ error: `type mismatch for union`, actual: stringifySchema(inspect(v)), expected: stringifySchema({ type: 'union', types }), value: v, path: p });
                else if (!ok && legit)
                    errs.push.apply(errs, legit);
            }
        }
        else if ((type === 'object' || type === 'object[]' || type === 'any') && fields || rest) {
            const arr = ~type.indexOf('[]') || schema.type === 'array';
            const val = arr ? value : [value];
            for (let i = 0; i < val.length; i++) {
                const v = val[i];
                const p = arr ? join(path, `${i}`) : path;
                if (typeof v !== 'object' && typeof v !== 'function') {
                    errs.push({ error: 'expected an object', value: v, path: p, actual: stringifySchema(inspect(v), true) });
                    continue;
                }
                if (fields) {
                    for (const f of fields) {
                        if (f.required && !(f.name in v))
                            errs.push({ error: `requried field ${f.name} is missing`, path: join(p, f.name) });
                        else if (v && f.name in v && (tmp = _validate(v[f.name], f, mode, join(p, f.name), extend$1(ctx, { value: v[f.name], path: join(p, f.name) }), f.required)) !== true)
                            errs.push.apply(errs, tmp);
                    }
                }
                if (rest && v) {
                    for (const k in v) {
                        if (fields && fields.find(f => f.name === k))
                            continue;
                        if (v[k] != null && (tmp = _validate(v[k], rest, mode, join(p, k), extend$1(ctx, { value: v[k], path: join(p, k) }))) !== true)
                            errs.push.apply(errs, tmp);
                    }
                }
                else if (mode === 'strict' && v) {
                    for (const k in v)
                        if (v[k] != null && !fields || !fields.find(f => f.name === k))
                            errs.push({ error: `unknown field ${k}`, path: p, type: 'strict', value: v[k] });
                }
            }
        }
        if (!errs.length && checks && checks.length) {
            let tmp;
            for (let i = 0; i < checks.length; i++) {
                const c = checks[i];
                tmp = evalApply(ctx, c, [value], true);
                if (!tmp || typeof tmp == 'string')
                    errs.push({ error: typeof tmp !== 'string' || !tmp ? `check ${i + 1} failed` : tmp, path, value, type: 'check', expected: stringifySchema(schema, true) });
            }
        }
        return errs.length ? errs : true;
    }
    const values = ['string', 'number', 'boolean', 'object'];
    function checkType(value, type, literal, required) {
        switch (type || 'any') {
            case 'any':
            case 'union':
                return true;
            case 'value': return !Array.isArray(value) && !!~values.indexOf(typeof value) && (typeof value !== 'object' || isDate(value));
            case 'array':
            case 'tuple':
            case 'union[]':
            case 'tuple[]':
                return Array.isArray(value);
            case 'literal': return value === literal;
            case 'string': return typeof value === 'string';
            case 'number': return typeof value === 'number';
            case 'boolean': return typeof value === 'boolean';
            case 'date': return isDate(value);
            case 'object': return !Array.isArray(value) && typeof value === 'object' && (!required || value != null);
            case 'string[]': return Array.isArray(value) && value.reduce((a, c) => a && typeof c === 'string', true);
            case 'number[]': return Array.isArray(value) && value.reduce((a, c) => a && typeof c === 'number', true);
            case 'boolean[]': return Array.isArray(value) && value.reduce((a, c) => a && typeof c === 'boolean', true);
            case 'date[]': return Array.isArray(value) && value.reduce((a, c) => a && isDate(c), true);
            case 'object[]': return Array.isArray(value) && value.reduce((a, c) => a && !Array.isArray(c) && typeof c === 'object' && (!required || c != null), true);
        }
    }

    const DEFAULTS = {
        record: '\n',
        field: ',',
        header: false,
        quote: '"',
    };
    function csv(options) {
        const opts = Object.assign({}, DEFAULTS, options);
        const ws = skip(' \t\r\n'.replace(opts.field, '').replace(opts.record, '').replace(opts.quote, ''));
        const quote = str(opts.quote || '"');
        const quotedField = bracket(seq(ws, quote), map(rep(alt(readTo(opts.quote), map(seq(quote, quote), () => ''))), r => concat$1(r)), seq(quote, ws));
        const unquotedField = readTo(opts.record + opts.field, true);
        const field = alt(quotedField, unquotedField);
        const record = verify(rep1sep(field, seq(ws, str(opts.field), ws)), s => s.length > 1 || s[0].length > 0 || 'empty record');
        const csv = repsep(record, str(opts.record), 'allow');
        const _parse = parser(csv, { consumeAll: true });
        return function parse(input, options) {
            const res = _parse(input, options);
            if (Array.isArray(res) && res.length > 0) {
                if (opts.header) {
                    const header = res.shift().map((k, i) => [k, i]);
                    header.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
                    for (let i = 0; i < res.length; i++) {
                        for (let j = 0; j < header.length; j++)
                            res[i][header[j][0]] = res[i][header[j][1]];
                    }
                }
            }
            return res;
        };
    }
    const fields = [',', '|', '\t', ':', ';', '~'];
    const records = ['\r\n', '\r', '\n'];
    const quotes = ['\'', '"', '`', '$'];
    function detect(data, amount = 2048) {
        const sample = data.slice(0, amount);
        const fs = fields.reduce((a, c) => (a[c] = sample.replace(new RegExp(`[^${c}]`, 'g'), '').length / c.length, a), {});
        const rs = records.reduce((a, c) => (a[c] = sample.replace(new RegExp(`[^${c}]`, 'g'), '').length / c.length, a), {});
        const qs = quotes.reduce((a, c) => (a[c] = sample.replace(new RegExp(`[^${c}]`, 'g'), '').length / c.length, a), {});
        const res = { field: ',', record: '\n', quote: '"' };
        let max = 0;
        for (const k in fs)
            if (fs[k] > max)
                (res.field = k, max = fs[k]);
        max = 0;
        for (const k in rs)
            if (rs[k] > max)
                (res.record = k, max = rs[k]);
        max = 0;
        for (const k in qs)
            if (qs[k] > max)
                (res.quote = k, max = qs[k]);
        return res;
    }
    function parse(data, options) {
        const base = csv(Object.assign({}, options, { header: false }))(data);
        if ('message' in base)
            return [];
        if (options.header && base.length) {
            const header = base.shift().map((k, i) => [k, i]);
            header.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
            return base.map(v => header.reduce((a, c) => (a[c[0]] = v[c[1]], a), {}));
        }
        return base;
    }

    function simple(names, apply) {
        return {
            type: 'value', names, apply
        };
    }
    const spanMap = {
        y: [0, 12],
        M: [1, 30],
        d: [2, 24],
    };
    const hasNum = /^[^\d]*(\d+(?:\.\d*)?)/;
    const space = /^\s*$/;
    function isNum(v) {
        return !isNaN(v) && !space.test(v);
    }
    function num(v) {
        if (isNaN(v) || !v)
            return 0;
        return +v;
    }
    function equals(l, r) {
        return l == r; // eslint-disable-line eqeqeq
    }
    /**
     * Find a the first overlapping substring that contains threshhold percent characters of the smallest string length.
     * @param a - the first string
     * @param b - the second string
     * @param threshhold - defaults to 0.5 - the percentage of the smaller string length needed to match
     * @returns - the substring that matches
     */
    function overlap(a, b, threshhold = 0.5) {
        const res = similar(a, b, threshhold, 0);
        return res && res[1] || undefined;
    }
    /**
     * Finds the percentage similarity between two strings based on a minimum threshhold and a fudge factor. The minimum threshhold determins the earliest that the search can return. The fudge factor allows skipping characters in either string, though there is no backtracking.
     * @param a - the first string
     * @param b - the second string
     * @param threshhold - defaults to 0.5 - the required similarity between two substrings, accounting for the fidge factor
     * @param fudges - the number skippable characters in either string without a match
     * @returns - the similarity of the first qualifying match
     */
    function similarity(a, b, threshhold = 0.5, fudges = 2) {
        const res = similar(a, b, threshhold, fudges);
        return res && res[2] || 0;
    }
    /**
     * Finds the similarity between two strings based on a minimum threshhold and a fudge factor. The minimum threshhold determins the earliest that the search can return. The fudge factor allows skipping characters in either string, though there is no backtracking.
     * @param a - the first string
     * @param b - the second string
     * @param threshhold - defaults to 0.5 - the required similarity between two substrings, accounting for the fudge factor
     * @param fudges - the number skippable characters in either string without a match
     * @returns - a tuple of the substrings from each string and the similarity percentage, accounting for the fudge factor
     */
    function similar(a, b, threshhold = 0.5, fudges = 2) {
        if (!a || !b)
            return;
        const aa = a.toLowerCase();
        const bb = b.toLowerCase();
        // check containment
        if (~aa.indexOf(bb))
            ;
        if (~bb.indexOf(aa))
            ;
        let i1 = 0;
        let i2 = 0;
        let oa = 0;
        let ob = 0;
        let f = 0;
        let f1 = 0;
        let f2 = 0;
        let fs = 0;
        let sim = 0;
        const alen = a.length;
        const blen = b.length;
        let aolen = 0;
        let bolen = 0;
        // walk a
        for (i1 = 0; i1 < alen; i1++) {
            // walk b
            for (i2 = 0; i2 < blen; i2++) {
                // if there's a match, see how far it goes
                if (aa[i1] === bb[i2]) {
                    aolen = alen - i1;
                    bolen = blen - i2;
                    fs = 0;
                    // walk the remaining pieces of each string checking for matches
                    matchy: for (oa = 1, ob = 1; oa < aolen && ob < bolen;) {
                        if (aa[i1 + oa] === bb[i2 + ob]) { // nailed it
                            oa++, ob++;
                        }
                        else { // not so much, so compare closer chars in each string, walking outward
                            for (f = 0; f <= fudges; f++) {
                                for (f1 = 0; f1 <= f; f1++) {
                                    for (f2 = 0; f2 <= f; f2++) {
                                        if (aa[i1 + oa + f1] === bb[i2 + ob + f2]) {
                                            oa += f1;
                                            ob += f2;
                                            fs += Math.max(f1, f2); // keep track of the fudge factor
                                            continue matchy;
                                        }
                                    }
                                }
                            }
                            break matchy; // not even fudge could save it
                        }
                    }
                    sim = (Math.max(oa, ob) - fs) / Math.min(aa.length, bb.length); // get approximate similarity
                    if (sim >= threshhold)
                        return [aa.substr(i1, oa), bb.substr(i2, ob), sim]; // and if it exceeds the threshold, we're good
                }
            }
        }
    }
    // basic ops
    registerOperator(simple(['is', 'is-not', '==', '!=', 'strict-is', 'strict-is-not'], (name, values) => {
        const [l, r] = values;
        const res = equals(l, r);
        return name === 'is' || name === '==' ? res : !res;
    }), simple(['strict-is', 'strict-is-not'], (name, values) => {
        const [l, r] = values;
        const res = l === r;
        return name === 'strict-is' ? res : !res;
    }), simple(['deep-is', 'deep-is-not', '===', '!=='], (name, values, _opts, ctx) => {
        let [l, r, equal] = values;
        if (equal && isApplication(equal)) {
            const eq = equal;
            equal = (l, r) => evalApply(ctx, eq, [l, r]);
        }
        const res = deepEqual(l, r, equal);
        return name === 'deep-is' || name === '===' ? res : !res;
    }), simple(['not'], (_name, values) => !values[0]), simple(['<', '>', '<=', '>=', 'gt', 'gte', 'lt', 'lte'], (name, values) => {
        if (name === 'gt')
            name = '>';
        else if (name === 'lt')
            name = '<';
        else if (name === 'gte')
            name = '>=';
        else if (name === 'lte')
            name = '<=';
        let [l, r] = values;
        if (l instanceof Date || r instanceof Date) {
            if (typeof l === 'number' || typeof r === 'number') {
                l = +l;
                r = +r;
            }
            else if (typeof l === 'string' || typeof r === 'string') {
                l = new Date(l);
                r = new Date(r);
            }
            else if (l && 'f' in l && 'o' in l) {
                l = dateRelToRange(l)[name[0] === '<' ? 1 : 0];
                r = new Date(r);
            }
            else if (r && 'f' in r && 'o' in r) {
                r = dateRelToRange(r)[name === '<' || name === '>=' ? 0 : 1];
                l = new Date(l);
            }
        }
        else if (isDateRel(l)) {
            l = dateRelToRange(l)[name[0] === '<' ? 1 : 0];
            r = isDateRel(r) ? dateRelToRange(r)[name === '<' || name === '>=' ? 0 : 1] : new Date(r);
        }
        else if (isDateRel(r)) {
            r = dateRelToRange(r)[name === '<' || name === '>=' ? 0 : 1];
            l = new Date(l);
        }
        return name === '<' ? l < r :
            name === '>' ? l > r :
                name === '<=' ? l <= r :
                    name === '>=' ? l >= r :
                        false;
    }), simple(['like', 'not-like', 'ilike', 'not-ilike'], (name, values) => {
        const [target, pattern, arg] = values;
        let res = false;
        const patterns = typeof pattern === 'string' ? [pattern] : pattern;
        const free = arg === 'free' || (typeof arg === 'object' && arg.free);
        if (!Array.isArray(patterns))
            return false;
        for (let i = 0; i < patterns.length && !res; i++) {
            const r = patterns[i];
            if (typeof r !== 'string')
                continue;
            const re = new RegExp(`${free ? '' : '^'}${r.replace(/[\s\%\*]+/g, '[\\s\\S]*').replace(/\?/g, '.')}${free ? '' : '$'}`, ~name.indexOf('ilike') ? 'i' : '');
            if (Array.isArray(target))
                res = !!target.find(v => re.test(v));
            else
                res = re.test(target);
        }
        return name === 'like' || name === 'ilike' ? res : !res;
    }), simple(['in', 'not-in'], (name, values, _opts, ctx) => {
        const [l, r] = values;
        let range;
        if (isDateRel(r)) {
            const range = dateRelToRange(r);
            const d = isDateRel(l) ? dateRelToRange(l)[0] : new Date(l);
            const n = d >= range[0] && d <= range[1];
            return name === 'in' ? n : !n;
        }
        else if (typeof l === 'string' && typeof r === 'object' && !Array.isArray(r)) {
            return l in r;
        }
        else if (Array.isArray(l) && l.length > 0 && typeof l[0] === 'string' && !Array.isArray(r) && r && typeof r === 'object') {
            const keys = Object.keys(r);
            const found = l.reduce((a, c) => a && ~keys.indexOf(c), true);
            return name === 'in' ? found : !found;
        }
        else if (typeof r === 'string' && isNum(l) && (range = _parseRange(ctx, r), Array.isArray(range))) {
            const found = range.reduce((a, c) => a || (Array.isArray(c) ? l >= c[0] && l <= c[1] : l == c), false);
            return name === 'in' ? found : !found;
        }
        else if (isApplication(l)) {
            let found = false;
            if (Array.isArray(r) || r && typeof r === 'object' && '0' in r)
                found = Array.prototype.find.call(r, (e, i) => evalApply(ctx, l, [e, i], false, { index: i, key: i }));
            else if (r && typeof r === 'object')
                found = Object.entries(r).find((e, i) => evalApply(ctx, l, [e[1], i, e[0]], false, { index: i, key: e[0] }));
            return name === 'in' ? !!found : !found;
        }
        else if (!Array.isArray(r) && typeof r !== 'string') {
            return name === 'in' ? l == r : l != r;
        }
        else if (Array.isArray(l) && Array.isArray(r)) {
            const b = l.reduce((a, c) => a && ~r.indexOf(c), true);
            return name === 'in' ? !!b : !b;
        }
        const res = !!~r.indexOf(l);
        return name === 'in' ? res : !res;
    }), simple(['contains', 'does-not-contain'], (name, values, _opts, ctx) => {
        const [l, r] = values;
        if (isDateRel(l)) {
            const range = dateRelToRange(l);
            const d = isDateRel(r) ? dateRelToRange(r)[0] : new Date(r);
            const n = d >= range[0] && d <= range[1];
            return name === 'contains' ? n : !n;
        }
        else if (isApplication(r)) {
            let found = false;
            if (Array.isArray(l) || l && typeof l === 'object' && '0' in l)
                found = Array.prototype.find.call(l, (e, i) => evalApply(ctx, r, [e, i], false, { index: i, key: i }));
            else if (r && typeof l === 'object')
                found = Object.entries(l).find((e, i) => evalApply(ctx, r, [e[1], i, e[0]], false, { index: i, key: e[0] }));
            return name === 'contains' ? !!found : !found;
        }
        else if (!Array.isArray(l) && typeof l !== 'string') {
            return false;
        }
        else if (Array.isArray(r) && Array.isArray(l)) {
            const b = r.reduce((a, c) => a && ~l.indexOf(c), true);
            return name === 'contains' ? !!b : !b;
        }
        const res = !!~l.indexOf(r);
        return name === 'contains' ? res : !res;
    }), simple(['clamp'], (_name, [min, v, max]) => {
        return v < min ? min : v > max ? max : v;
    }), simple(['get'], (_name, values, _opts, ctx) => {
        const [l, r] = values;
        const c = extend$1(ctx, { value: l });
        if (isKeypath(r))
            return safeGet(c, r);
        else
            return evaluate(c, r);
    }), simple(['array'], (_name, values) => {
        return values;
    }), simple(['object'], (_name, values) => {
        const res = {};
        for (let i = 0; i < values.length; i += 2) {
            res[values[i]] = values[i + 1];
        }
        return res;
    }), simple(['split'], (_name, [str, split]) => {
        if (typeof str !== 'string')
            return [str];
        else
            return str.split(split || '');
    }), simple(['filter'], (_name, values, _opts, ctx) => {
        let [arr, flt, sorts, groups] = values;
        if (!Array.isArray(arr)) {
            if (arr && Array.isArray(arr.value))
                arr = arr.value;
            else if (typeof arr === 'object' && arr)
                return Object.entries(arr).filter((e, i) => evalApply(ctx, flt, [e[1], i, e[0]], false, { index: i, key: e[0] })).reduce((a, c) => (a[c[0]] = c[1], a), {});
            else
                return [];
        }
        return filter({ value: arr }, flt, sorts, groups, ctx).value;
    }), simple(['source'], (_name, values, _opts, ctx) => {
        const [val, app] = values;
        let source = typeof val === 'object' && val && 'value' in val ? val : { value: val };
        if (isApplication(app))
            return evalApply(ctx, app, [], false, { source });
        return source;
    }), simple(['group'], (_name, values, _opts, ctx) => {
        let [arr, groups] = values;
        if (!Array.isArray(arr)) {
            if (arr && Array.isArray(arr.value))
                arr = arr.value;
            else
                return {};
        }
        return filter({ value: arr }, null, null, groups, ctx).value;
    }), simple(['sort'], (_name, values, _opts, ctx) => {
        let [arr, sort] = values;
        if (!Array.isArray(arr)) {
            if (arr && Array.isArray(arr.value))
                arr = arr.value;
            else
                return {};
        }
        return filter({ value: arr }, null, sort, null, ctx).value;
    }), simple(['time-span', 'time-span-ms'], (_name, args, opts) => {
        const namedArgs = opts || {};
        const span = isDateRel(args[0]) && isDateRel(args[1]) ? datesDiff(dateRelToDate(args[0]), dateRelToDate(args[1])) : isTimespan(args[0]) ? args[0] : 0;
        // if a unit is specified, break the span up
        if (namedArgs.unit) {
            const u = (Array.isArray(namedArgs.unit) ? namedArgs.unit : [namedArgs.unit]).map(u => {
                if (u[0] === 'y')
                    return 'y';
                else if (u[0] === 'M' || (u[0] === 'm' && u[1] !== 'i' && u[1] !== 'm'))
                    return 'M';
                else if (u[0] === 'w')
                    return 'w';
                else if (u[0] === 'd')
                    return 'd';
                else if (u[0] === 'h')
                    return 'h';
                else if (u[0] === 'm' && (!u[1] || u[1] === 'i' || u[1] === 'm'))
                    return 'm';
                else if (u[0] === 's')
                    return 's';
                else if (u[0] === 'm' && u[1] === 's')
                    return 'l';
                return '';
            }).filter(u => !!u);
            // fraction tracks what would be left for rounding
            let fraction;
            let res;
            // special case for full spans
            if (typeof span !== 'number' && !isTimespanMS(span)) {
                const us = u.join('');
                if (us === 'd') {
                    if (span.s) {
                        const from = new Date(span.s);
                        from.setHours(0);
                        from.setMinutes(0);
                        from.setSeconds(0);
                        from.setMilliseconds(0);
                        const to = new Date(+from);
                        to.setDate(1);
                        to.setFullYear(to.getFullYear() + span.d[0]);
                        to.setMonth(from.getMonth() + span.d[1]);
                        const m = to.getMonth();
                        to.setDate(from.getDate());
                        if (to.getMonth() !== m)
                            to.setDate(0);
                        to.setDate(to.getDate() + span.d[2]);
                        const dist = +to - +from;
                        let d = Math.floor(dist / 86400000);
                        const r = dist % 86400000;
                        if (r >= 82800000)
                            d++;
                        res = [d];
                    }
                    else {
                        // this is an approximation
                        res[0] += span.d[0] * 365;
                        res[0] += span.d[1] * 30;
                    }
                }
                else if (u.length < 4 && (us === 'y' || us === 'yM' || us === 'yMd' || us === 'M' || us === 'Md' || us === 'd')) {
                    res = u.map(u => {
                        fraction = span.d[spanMap[u][0] + 1] / spanMap[u][1];
                        return span.d[spanMap[u][0]];
                    });
                    if (u[0] === 'M')
                        res[0] += span.d[0] * 12;
                }
            }
            // this isn't special cased, so get a number of ms
            if (!res) {
                let ms = typeof span === 'number' || isTimespanMS(span) ? timeSpanToNumber(span) : span && 's' in span ? +dateAndTimespan(new Date(span.s), span, 1) - +new Date(span.s) : (span.d[0] * timespans.y + span.d[1] * timespans.m + span.d[2] * timespans.d +
                    span.d[3] * timespans.h + span.d[4] * timespans.mm + span.d[5] * timespans.s + span.d[6]);
                res = u.map(() => 0);
                const next = { y: 'm', M: 'w', w: 'd', d: 'h', h: 'mm', m: 's' };
                const nextDiv = { y: 12, M: 4.3, w: 7, d: 24, h: 60, m: 60 };
                for (let i = 0; i < res.length; i++) {
                    const k = u[i] === 'm' ? 'mm' : u[i] === 'M' ? 'm' : u[i];
                    if (k === 'l') {
                        res[i] = ms;
                        fraction = 0;
                        break;
                    }
                    res[i] = Math.floor(ms / timespans[k]);
                    ms -= res[i] * timespans[k];
                    if (next[u[i]])
                        fraction = (ms / timespans[next[u[i]]]) / nextDiv[u[i]];
                    else if (u[i] === 's')
                        fraction = ms % 1000;
                }
            }
            // check for rounding
            if (namedArgs.round === true) {
                if (fraction >= 0.5)
                    res[res.length - 1]++;
            }
            else if ((namedArgs.round || '')[0] === 'c') {
                if (fraction > 0)
                    res[res.length - 1]++;
                // very special case for months that get rounded to a year
                if (u[0] === 'y' && u[1] === 'M' && u.length === 2 && res[1] === 12) {
                    res[0]++;
                    res[1] = 0;
                }
            }
            // check to see if stringification is needed
            if (namedArgs.string) {
                const units = { y: 'year', M: 'month', w: 'week', d: 'day', h: 'hour', m: 'minute', s: 'second', l: 'millisecond' };
                let str = '';
                for (let i = 0; i < u.length; i++) {
                    if (!res[i])
                        continue;
                    str += `${str.length ? ' ' : ''}${res[i]} ${units[u[i]]}${res[i] > 1 ? 's' : ''}`;
                }
                return str;
            }
            else
                return Array.isArray(namedArgs.unit) ? res : res[0];
        }
        else {
            if (namedArgs.string) {
                if (typeof span === 'number' || isTimespanMS(span)) {
                    let ms = timeSpanToNumber(span);
                    let res = '';
                    const order = ['w', 'd', 'h', 'mm', 's'];
                    const units = ['week', 'day', 'hour', 'minute', 'second', 'millisecond'];
                    for (let i = 0; i < order.length; i++) {
                        if (ms > timespans[order[i]]) {
                            const u = Math.floor(ms / timespans[order[i]]);
                            ms -= timespans[order[i]] * u;
                            res += `${res.length ? ' ' : ''}${u} ${units[i]}${u > 1 ? 's' : ''}`;
                        }
                    }
                    if (ms) {
                        res += `${res.length ? ' ' : ''}${ms} millisecond${ms > 1 ? 's' : ''}`;
                    }
                }
                else {
                    let res = '';
                    const units = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
                    for (let i = 0; i < span.d.length; i++) {
                        if (span.d[i])
                            res += `${res.length ? ' ' : ''}${span.d[i]} ${units[i]}${span.d[i] > 1 ? 's' : ''}`;
                    }
                    return res;
                }
            }
            else
                return span;
        }
    }), simple(['string', 'unparse'], (name, args) => {
        const [value] = args;
        let opts = args.slice(-1)[0] || {};
        if (name === 'unparse')
            opts = Object.assign({}, opts, { raport: 1 });
        if (opts.raport && opts.tpl)
            opts.template = 1;
        if (!opts && (value === null || value === undefined))
            return '';
        if (typeof opts === 'object' && opts.json)
            return JSON.stringify(value);
        if (typeof opts === 'object' && opts.schema)
            return stringifySchema(value);
        else if (typeof opts === 'object' && opts.raport) {
            let v = stringify(value, opts);
            if (v === undefined)
                v = stringify({ v: value }, opts);
            return v;
        }
        if (Array.isArray(value))
            return value.join(', ');
        let res = `${value}`;
        if (res.slice(0, 7) === '[object')
            return JSON.stringify(value);
        return res;
    }), simple(['call'], (_name, args, _opts, ctx) => {
        if (args[0] != null && typeof args[1] === 'string' && typeof args[0][args[1]] === 'function') {
            const obj = args.shift();
            const name = args.shift();
            return obj[name].apply(obj, args);
        }
        if (typeof args[0] === 'function') {
            const fn = args.shift();
            return fn.apply(null, args);
        }
        if (isValue(args[0])) {
            return evalApply(ctx, args[0], args.slice(1));
        }
    }), simple(['intersect'], (_name, [left, right]) => {
        if (!Array.isArray(left) || !Array.isArray(right))
            return [];
        const res = [];
        let el;
        for (let i = 0; i < left.length; i++) {
            el = left[i];
            if (~right.indexOf(el) && !~res.indexOf(el))
                res.push(el);
        }
        for (let i = 0; i < right.length; i++) {
            el = right[i];
            if (!~res.indexOf(el) && ~left.indexOf(el))
                res.push(el);
        }
        return res;
    }), simple(['let'], (_name, [name, value], _opts, ctx) => {
        return safeSet(ctx, name, value, true);
    }), simple(['set'], (_name, [name, value], _opts, ctx) => {
        return safeSet(ctx, name, value);
    }), simple(['similarity'], (_name, [left, right, threshhold, fudges]) => {
        return similarity(`${left || ''}`, `${right || ''}`, threshhold, fudges);
    }), simple(['similar'], (_name, [left, right, threshhold, fudges]) => {
        return similar(`${left || ''}`, `${right || ''}`, threshhold, fudges);
    }), simple(['overlap'], (_name, [left, right, threshhold]) => {
        return overlap(`${left || ''}`, `${right || ''}`, threshhold);
    }), simple(['validate', 'valid'], (name, [left, right, mode], opts) => {
        const res = validate(left, right, mode || (opts === null || opts === void 0 ? void 0 : opts.mode) || ((opts === null || opts === void 0 ? void 0 : opts.strict) && 'strict'));
        if (name === 'valid')
            return res === true;
        else
            return res;
    }), simple(['inspect'], (_name, [v, mode], opts) => {
        if ((mode || (opts === null || opts === void 0 ? void 0 : opts.mode)) === 'schema')
            return stringifySchema(inspect(v, opts === null || opts === void 0 ? void 0 : opts.flat));
        else
            return inspect(v);
    }), simple(['diff'], (_, [left, right, equal], _opts, ctx) => {
        if (equal && isApplication(equal)) {
            const eq = equal;
            equal = (l, r) => evalApply(ctx, eq, [l, r]);
        }
        return diff(left, right, equal);
    }), simple(['label-diff'], (_, [diff, label], opts) => {
        return labelDiff(diff, label, opts);
    }));
    // math
    registerOperator(simple(['+', 'add'], (_name, values) => {
        if (values.length === 1) {
            if (isDateRel(values[0]))
                return +dateRelToDate(values[0]);
            else if (!values[0])
                return 0;
            return parseFloat(values[0]);
        }
        if (Array.isArray(values[0]))
            return values[0].concat.apply(values[0], values.slice(1));
        else if (isDateRel(values[0]) && values.length > 1 && values.slice(1).reduce((a, c) => a && isTimespan(c), true))
            return values.slice(1).reduce((a, c) => dateAndTimespan(a, c, 1), dateRelToDate(values[0]));
        else if (typeof values[0] !== 'number' && values.length > 1 && isTimespan(values[0]))
            return values.slice(1).reduce((a, c) => addTimespan(a, c), values[0]);
        else if (values.reduce((a, c) => a && typeof c === 'object' && !isDateRel(c), true))
            return Object.assign.apply(Object, [{}].concat(values));
        const num = values.reduce((a, c) => a && isNum(c), true);
        if (num) {
            return values.reduce((a, c) => a + +c, 0);
        }
        else {
            return values.reduce((a, c) => a + (c === undefined || c === null ? '' : c), '');
        }
    }), simple(['num'], (_name, [v]) => {
        let match;
        if (match = hasNum.exec(v))
            return +match[1];
        return parseInt(v);
    }), simple(['-', 'subtract'], (_name, values) => {
        const first = values.shift();
        if (isDateRel(first)) {
            if (values.reduce((a, c) => a && isDateRel(c), true))
                return values.reduce((a, c) => a - +dateRelToDate(c), +dateRelToDate(first));
            if (values.reduce((a, c) => a && isTimespan(c), true))
                return values.reduce((a, c) => dateAndTimespan(a, c, -1), dateRelToDate(first));
        }
        return values.reduce((a, c) => a - (!isNum(c) ? 0 : +c), !isNum(first) ? 0 : +first);
    }), simple(['*', 'multiply'], (_name, values) => {
        const first = values.shift();
        if (!isNum(first)) {
            if (typeof first === 'string' && values.length === 1 && isNum(values[0]) && +values[0] > 0) {
                let s = '';
                for (let i = 0; i < values[0]; i++)
                    s += first;
                return s;
            }
            return 0;
        }
        return values.reduce((a, c) => a * (!isNum(c) ? 0 : +c), +first);
    }), simple(['/', '/%', 'divide', 'intdiv'], (name, values) => {
        const first = values.shift();
        if (isNaN(first))
            return 0;
        if (name.length > 1 || name === 'intdiv')
            return values.reduce((a, c) => Math.floor(a / (isNaN(c) ? 1 : +c)), +first);
        else
            return values.reduce((a, c) => a / (isNaN(c) ? 1 : +c), +first);
    }), simple(['%', 'modulus'], (_name, values) => {
        const first = values.shift();
        return values.reduce((a, c) => a % (isNaN(c) ? 1 : +c), isNaN(first) ? 0 : +first);
    }), simple(['pow', '**'], (_name, values) => {
        const pow = values.pop();
        const first = Math.pow(values.pop(), pow);
        return values.reverse().reduce((a, c) => Math.pow(c, a), first);
    }), simple(['abs'], (_name, values) => {
        if (typeof values[0] !== 'number')
            return values[0];
        return Math.abs(values[0]);
    }), simple(['round'], (_name, values) => {
        return Math.round(values[0]);
    }), simple(['floor'], (_name, values) => {
        return Math.floor(values[0]);
    }), simple(['ceil'], (_name, values) => {
        return Math.ceil(values[0]);
    }), simple(['rand', 'random'], (_name, [min, max, dec]) => {
        let res;
        if (min == null)
            return Math.random();
        else if (typeof max !== 'number')
            res = Math.random() * min;
        else if (typeof max === 'number')
            res = Math.random() * (max - min) + min;
        if (max === true || dec === true)
            return res;
        else
            return Math.round(res);
    }));
    // string
    function pad(where, str, count, pad) {
        if (typeof str !== 'string')
            str = '' + str;
        if (!isNum(count))
            return str;
        if (!pad)
            pad = ' ';
        if (typeof pad !== 'string')
            pad = '' + pad;
        if (pad.length < 1)
            pad = ' ';
        const ct = (count - str.length) / 2;
        for (let i = 0; str.length < count; i++) {
            if (where === 'l')
                str = pad + str;
            else if (where === 'r')
                str = str + pad;
            else if (i < ct)
                str = pad + str;
            else
                str = str + pad;
        }
        return str;
    }
    const triml = /^\s*/;
    const trimr = /\s*$/;
    const escapeRe = /([\.\[\]\{\}\(\)\^\$\*\+\-])/g;
    registerOperator(simple(['eval'], (_name, [v], _opts, ctx) => {
        return evaluate(ctx, v);
    }), simple(['padl', 'padr', 'pad'], (name, args) => {
        let [str, count, val] = args;
        return pad(name === 'padl' ? 'l' : name === 'padr' ? 'r' : 'c', str, count, val);
    }), simple(['trim', 'triml', 'trimr'], (name, args) => {
        let [str] = args;
        str = '' + str;
        if (name === 'trim' || name === 'trimr')
            str = str.replace(trimr, '');
        if (name === 'trim' || name === 'triml')
            str = str.replace(triml, '');
        return str;
    }), simple(['slice', 'substr'], (_name, [src, start, end], _opts, ctx) => {
        if (src && typeof src.slice === 'function')
            return src.slice(start, end);
        else {
            const op = getOperator('string');
            if (op)
                return `${op.apply('string', [src], undefined, ctx)}`.slice(start, end);
        }
    }), simple(['len', 'length'], (_name, [src]) => {
        if (src && 'length' in src)
            return src.length;
        return 0;
    }), simple(['replace', 'replace-all'], (name, [str, find, rep, flags]) => {
        str = `${str}`;
        const re = typeof flags === 'string';
        if (name === 'replace-all' || re) {
            return str.replace(new RegExp(re ? find : find.replace(escapeRe, '\\$1'), (name === 'replace' || (flags && ~flags.indexOf('g')) ? flags : `${flags || ''}g`) || 'g'), rep);
        }
        else {
            return str.replace(find, rep);
        }
    }), simple(['reverse'], (_name, [src]) => {
        if (typeof src === 'string') {
            let r = '';
            for (let i = 0; i < src.length; i++)
                r = src[i] + r;
            return r;
        }
        else if (Array.isArray(src)) {
            return src.reverse();
        }
    }), simple(['keys'], (_name, [src, proto]) => {
        if (!src)
            return [];
        if (proto) {
            const res = [];
            for (const k in src)
                res.push(k);
            return res;
        }
        else {
            return Object.keys(src);
        }
    }), simple(['values'], (_name, [src]) => {
        if (!src)
            return [];
        return Object.values(src);
    }), simple(['date'], (_name, args, opts, ctx) => {
        let [v, t] = args;
        if (typeof opts !== 'object' || !opts)
            opts = {};
        let res;
        if (v !== undefined) {
            if (isDateRel(v))
                res = dateRelToDate(v);
            else if (typeof v === 'string') {
                let dt = parseDate(v);
                if (isDateRel(dt)) {
                    res = dt;
                }
                else {
                    if (!dt)
                        dt = new Date(v);
                    if (isNaN(dt)) {
                        let val = evaluate(ctx, ~v.indexOf('#') ? v : `#${v}#`);
                        if (isDateRel(val)) {
                            if (opts.rel || opts.parse)
                                res = val;
                            else
                                res = dateRelToDate(val);
                        }
                    }
                }
            }
            if (!res)
                res = new Date(v);
        }
        else
            res = new Date();
        if ((opts.rel || opts.parse) && isDateRel(res)) {
            let rel = dateRelToExactRange(res);
            if (typeof t === 'string')
                t = parseTime(t);
            if (Array.isArray(t)) {
                const f = rel.f;
                f[3] = t[0], f[4] = t[1], f[5] = t[2], f[6] = t[3];
                t = t[4];
            }
            if (typeof t === 'number') {
                if (opts.shift) {
                    const diff = (+rel.f[7] || 0) - t;
                    const dt = dateRelToDate(rel);
                    dt.setMinutes(dt.getMinutes() - diff);
                    rel = dateRelToExactRange(dt);
                }
                rel.f[7] = t;
                res = rel;
            }
        }
        else {
            const rdt = isDateRel(res) ? dateRelToDate(res) : res;
            if ('y' in opts && !isNaN(opts.y))
                rdt.setFullYear(opts.y);
            const y = rdt.getFullYear();
            if ('m' in opts && !isNaN(opts.m)) {
                rdt.setMonth(+opts.m - 1);
                if (opts.clamp && rdt.getFullYear() !== y) {
                    rdt.setFullYear(y);
                    rdt.setMonth(11);
                }
            }
            const m = rdt.getMonth();
            if ('d' in opts && !isNaN(opts.d)) {
                rdt.setDate(opts.d);
                if (opts.clamp && (rdt.getMonth() !== m || rdt.getFullYear() !== y)) {
                    rdt.setDate(1);
                    rdt.setFullYear(y);
                    rdt.setMonth(m + 1);
                    rdt.setDate(0);
                }
            }
            if (t) {
                if (res === v) {
                    if (typeof v === 'string') {
                        const dt = parseDate(v);
                        if (dt && isDateRel(dt))
                            res = dateRelToDate(dt);
                        else
                            res = new Date(v);
                    }
                    else
                        res = new Date(v);
                }
                if (typeof t === 'string')
                    t = parseTime(t);
                if (Array.isArray(t)) {
                    rdt.setHours(t[0] || 0, t[1] || 0, t[2] || 0, t[3] || 0);
                    if (t[4] != null) {
                        const offset = -rdt.getTimezoneOffset() - t[4];
                        rdt.setMinutes(rdt.getMinutes() + offset);
                    }
                }
                else if (typeof t === 'number') {
                    const offset = -rdt.getTimezoneOffset() - t;
                    rdt.setMinutes(rdt.getMinutes() + offset);
                }
            }
            res = rdt;
        }
        return res;
    }), simple(['interval'], (_name, [v], _opts, ctx) => {
        return evaluate(ctx, ~v.indexOf('#') ? v : `#${v}#`);
    }), simple(['upper', 'lower'], (name, [v]) => {
        v = v == null ? '' : v;
        return name === 'upper' ? `${v}`.toUpperCase() : `${v}`.toLowerCase();
    }), simple(['format', 'fmt'], (_name, args, opts) => {
        let [n, v, ...s] = args;
        const fmt = formats[v];
        if (!fmt)
            return `${n}`;
        else
            return fmt.apply(n, s, opts);
    }), simple(['set-defaults'], (_name, [type, name], opts) => {
        if (type === 'format' && typeof name === 'string') {
            const fmt = formats[name];
            if (fmt)
                return Object.assign(fmt.defaults, opts);
        }
    }), simple(['parse'], (_name, args) => {
        let opts = args.slice(-1)[0] || {};
        if (typeof opts !== 'object')
            opts = {};
        const [v] = args;
        if (opts.date)
            return parseDate(v, opts);
        else if (opts.template || opts.tpl)
            return parse$1(v, opts);
        else if (opts.time)
            return parseTime(v, opts);
        else if (opts.expr)
            return parseExpr(v, opts);
        else if (opts.schema)
            return parseSchema(v);
        else if (opts.range)
            return range(v, opts);
        else if (opts.csv) {
            if (opts.detect)
                opts = Object.assign(detect(v), opts);
            return parse(v, opts);
        }
        else
            return parse$2(v, opts);
    }), simple(['detect-delimiters'], (_name, [data]) => {
        if (typeof data !== 'string')
            return {};
        return detect(data);
    }));
    // short circuiting
    registerOperator({
        type: 'checked',
        names: ['and', '&&'],
        checkArg(_name, _i, _total, value) {
            if (value)
                return 'continue';
            else
                return { result: value };
        },
        apply(_name, args) {
            return args[args.length - 1]; // passed the check, all is well
        },
    }, {
        type: 'checked',
        names: ['or', '||', '??'],
        checkArg(name, _i, _total, value) {
            if (name === '??' ? value != null : value)
                return { result: value };
            else
                return 'continue';
        },
        apply(name) {
            return name === '??' ? undefined : false; // if we made it this far, none were true
        },
    }, {
        type: 'checked',
        names: ['if', 'unless'],
        checkArg(name, i, last, value) {
            if (i % 2 === 0) {
                if (i === last)
                    return { result: value }; // else case
                else if (name === 'if' ? !value : value)
                    return { skip: 1 }; // non-matching branch, skip next
                else
                    return 'continue'; // matching, carry on to next
            }
            else
                return { result: value }; // odd branch that wasn't skipped means previous condition matched
        },
        apply() { }
    }, {
        type: 'checked',
        names: ['case', 'switch'],
        checkArg(_name, i, last, value, _opts, ctx, ast) {
            if (i === 0) { // set the value and move to the next
                (ctx.special || (ctx.special = {})).case = value;
                return 'continue';
            }
            else if (i % 2 === 1) {
                if (i === last)
                    return { result: value }; // default case
                if (equals(value, ctx.special.case))
                    return 'continue';
                if (isValue(ast) && 'op' in ast && value === true)
                    return 'continue'; // operators can also check for true
                if (isValue(value)) {
                    const v = evalValue(ctx, value);
                    if (equals(v, ctx.special.case))
                        return 'continue';
                    if (v === true)
                        return 'continue';
                }
                return { skip: 1 };
            }
            else
                return { result: value }; // odd branch
        },
        apply() { },
        extend: true,
    }, {
        type: 'checked',
        names: ['each'],
        checkArg(_name, i, last, value) {
            if (i === 0) {
                if (Array.isArray(value) && value.length || value && typeof value === 'object' && Object.keys(value).length)
                    return 'continue';
                else
                    return { skip: 1 };
            }
            else if (i === 1)
                return { skip: last - i, value };
            else if (i === last)
                return { result: value };
            else if (i % 2 === 0) { // condition
                if (value)
                    return 'continue';
                else
                    return { skip: 1 };
            }
            else
                return { result: value };
        },
        apply(_name, [value, body], opts, ctx) {
            if (Array.isArray(value)) {
                const last = value.length - 1;
                return value.map((v, i) => evalApply(extend$1(ctx, { value: v, special: { last, index: i, key: i, 'last-key': last } }), body, [v, i])).join((opts === null || opts === void 0 ? void 0 : opts.join) || '');
            }
            else if (typeof value === 'object' && value) {
                const entries = Object.entries(value);
                const lastKey = entries[entries.length - 1][0];
                const last = entries.length - 1;
                return Object.entries(value).map(([k, v], i) => evalApply(extend$1(ctx, { value: v, special: { last, 'last-key': lastKey, index: i, key: k } }), body, [v, k])).join('');
            }
            else {
                return '';
            }
        }
    }, {
        type: 'checked',
        names: ['with'],
        checkArg(_name, i, last, value) {
            if (i === 0 && value && typeof value === 'object')
                return 'continue';
            else if (i === 1)
                return { skip: last - i, value };
            else if (i === last)
                return { result: value };
            else if (i % 2 === 0) {
                if (value)
                    return 'continue';
                else
                    return { skip: 1 };
            }
            else
                return { result: value };
        },
        apply(_name, [value, body], _opts, ctx) {
            return evalApply(extend$1(ctx, { value }), body, [value]);
        }
    }, {
        type: 'checked',
        names: ['coalesce', 'coalesce-truth'],
        checkArg(name, _i, _last, value) {
            if (name === 'coalesce' && value !== undefined && value !== null)
                return { result: value };
            else if (value)
                return { result: value };
            else
                return 'continue';
        },
        apply() { }
    });
    // aggregates
    registerOperator({
        type: 'aggregate',
        names: ['avg'],
        apply(_name, arr, args, _opts, ctx) {
            return arr.reduce((a, c) => a + num(args[0] ? evalApply(ctx, args[0], [c]) : c), 0) / arr.length;
        },
    }, {
        type: 'aggregate',
        names: ['sum'],
        apply(_name, arr, args, _opts, ctx) {
            return arr.reduce((a, c) => a + num(args[0] ? evalApply(ctx, args[0], [c]) : c), 0);
        }
    }, {
        type: 'aggregate',
        names: ['count'],
        apply(_name, arr, args, _opts, ctx) {
            if (args.length)
                return arr.filter((e, i) => evalApply(ctx, args[0], [e, i])).length;
            else
                return arr.length;
        }
    }, {
        type: 'aggregate',
        names: ['min', 'max'],
        apply(name, arr, args, _opts, ctx) {
            if (isApplication(args[0]))
                arr = arr.map(e => evalApply(ctx, args[0], [e]));
            else if (args.length && !arr.length)
                arr = args.map(a => evalParse(ctx, a));
            if (!arr.length)
                return 0;
            return Math[name].apply(Math, arr.filter(e => !isNaN(e)));
        }
    }, {
        type: 'aggregate',
        names: ['first', 'nth', 'last'],
        apply(name, arr, args, _opts, ctx) {
            let val;
            let apply = 0;
            if (name === 'first')
                val = arr[0];
            else if (name === 'last')
                val = arr[arr.length - 1];
            else if (args[0]) {
                const i = evalParse(ctx, args[0]);
                if (typeof i === 'number') {
                    val = i < 0 ? arr[arr.length + i] : arr[i - 1];
                    apply = 1;
                }
            }
            if (args[apply])
                val = evalParse(ctx, args[apply]);
            return val;
        }
    }, {
        type: 'aggregate',
        names: ['map'],
        apply(_name, arr, args, opts, ctx) {
            if (!args[0])
                return arr;
            let v;
            let app;
            if (isApplication(args[0]))
                v = arr, app = evalParse(ctx, args[0]);
            else if (isApplication(args[1]))
                v = evalParse(ctx, args[0]), app = evalParse(ctx, args[1]);
            if ((Array.isArray(v) || v && '0' in v) && isApplication(app))
                return Array.prototype.map.call(v, (e, i) => evalApply(ctx, app, [e, i], false, { index: i, key: i }));
            else if (v && typeof v === 'object' && isApplication(app)) {
                if (opts && opts.array)
                    return Object.entries(v).map((p, i) => evalApply(ctx, app, [p[1], i, p[0]], false, { index: i, key: p[0] }));
                if (opts && opts.entries)
                    return Object.entries(v).reduce((a, p, i) => {
                        const r = evalApply(ctx, app, [p[1], i, p[0]], false, { index: i, key: p[0] });
                        if (r === null)
                            return a;
                        if (Array.isArray(r) && r.length === 2 && typeof r[0] === 'string')
                            a.push(r);
                        else
                            a.push([p[0], r]);
                        return a;
                    }, []);
                const res = {};
                Object.entries(v).forEach((e, i) => {
                    const r = evalApply(ctx, app, [e[1], i, e[0]], false, { index: i, key: e[0] });
                    if (Array.isArray(r) && r.length === 2 && typeof r[0] === 'string')
                        res[r[0]] = r[1];
                    else if (r == null)
                        return;
                    else
                        res[e[0]] = r;
                });
                return res;
            }
        }
    }, {
        type: 'aggregate',
        names: ['reduce'],
        apply(_name, arr, args, _opts, ctx) {
            if (!args[0])
                return arr;
            return arr.reduce((a, c, i) => evalApply(ctx, args[0], [a, c, i]), evalParse(ctx, args[1]));
        }
    }, {
        type: 'aggregate',
        names: ['unique', 'unique-map'],
        apply(name, arr, args, _opts, ctx) {
            const seen = [];
            const res = [];
            for (const e of arr) {
                const f = args[0] ? evalApply(ctx, args[0], [e]) : e;
                if (!~seen.indexOf(f)) {
                    seen.push(f);
                    res.push(e);
                }
            }
            return name === 'unique' ? res : seen;
        }
    }, {
        type: 'aggregate',
        names: ['join'],
        apply(_name, arr, args, _opts, ctx) {
            if (args.length > 1)
                return arr.map(e => evalApply(ctx, args[0], [e])).join(evalParse(ctx, args[1]));
            return arr.join(evalParse(ctx, args[0]));
        }
    }, {
        type: 'aggregate',
        names: ['find'],
        apply(_name, arr, args, _opts, ctx) {
            if (!args[0])
                return;
            else if (isApplication(args[0]))
                return arr.find((e, i) => evalApply(ctx, args[0], [e, i], false, { index: i, key: i }));
            else if (isApplication(args[1])) {
                const v = evalParse(ctx, args[0]);
                if (Array.isArray(v))
                    return v.find((e, i) => evalApply(ctx, args[1], [e, i], false, { index: i, key: i }));
                else if (typeof v === 'object' && v) {
                    const e = Object.entries(v).find((e, i) => evalApply(ctx, args[1], [e[1], i, e[0]], false, { index: i, key: e[0] }));
                    if (e)
                        return e[1];
                }
            }
            else {
                const v = evalParse(ctx, args[0]);
                return arr.find(e => e == v);
            }
        }
    }, {
        type: 'aggregate',
        names: ['block'],
        apply(_name, _arr, args, _opts, ctx) {
            const last = args.length - 1;
            if (last < 0)
                return;
            const c = extend$1(ctx, { locals: {} });
            for (let i = 0; i < last; i++)
                evalParse(c, args[i]);
            return evalParse(c, args[last]);
        },
        value: true,
    });
    function fmtDate(n, fmt) {
        if (typeof n === 'string') {
            const d = parseDate(n);
            if (d)
                n = d;
        }
        return date$1(isDateRel(n) ? dateRelToExactRange(n) : n, fmt);
    }
    function _parseRange(ctx, range$1) {
        const map = ctx.root._ranges || (ctx.root._ranges = {});
        if (range$1 in map)
            return map[range$1];
        return (map[range$1] = range(range$1));
    }
    // basic formats
    registerFormat('dollar', function (n, [dec, group, sign, neg], opts) {
        var _a, _b, _c, _d;
        return dollar(n, undefined, (_a = dec !== null && dec !== void 0 ? dec : opts === null || opts === void 0 ? void 0 : opts.dec) !== null && _a !== void 0 ? _a : this.defaults.dec, (_b = group !== null && group !== void 0 ? group : opts === null || opts === void 0 ? void 0 : opts.group) !== null && _b !== void 0 ? _b : this.defaults.group, (_c = sign !== null && sign !== void 0 ? sign : opts === null || opts === void 0 ? void 0 : opts.sign) !== null && _c !== void 0 ? _c : this.defaults.sign, (_d = neg !== null && neg !== void 0 ? neg : opts === null || opts === void 0 ? void 0 : opts.neg) !== null && _d !== void 0 ? _d : this.defaults.neg);
    }, { dec: 2, group: ',', sign: '$', neg: 'sign' });
    registerFormat('date', function (n, [fmt], opts) {
        var _a;
        return fmtDate(n, (_a = fmt !== null && fmt !== void 0 ? fmt : opts === null || opts === void 0 ? void 0 : opts.format) !== null && _a !== void 0 ? _a : this.defaults.format);
    }, { format: 'yyyy-MM-dd' });
    registerFormat('time', function (n, [fmt], opts) {
        var _a;
        return fmtDate(n, (_a = fmt !== null && fmt !== void 0 ? fmt : opts === null || opts === void 0 ? void 0 : opts.format) !== null && _a !== void 0 ? _a : this.defaults.format);
    }, { format: 'HH:mm:ss' });
    registerFormat('timestamp', function (n, [fmt], opts) {
        var _a;
        return fmtDate(n, (_a = fmt !== null && fmt !== void 0 ? fmt : opts === null || opts === void 0 ? void 0 : opts.format) !== null && _a !== void 0 ? _a : this.defaults.format);
    }, { format: 'yyyy-MM-dd HH:mm:ss' });
    registerFormat('timestamptz', function (n, [fmt], opts) {
        var _a;
        return fmtDate(n, (_a = fmt !== null && fmt !== void 0 ? fmt : opts === null || opts === void 0 ? void 0 : opts.format) !== null && _a !== void 0 ? _a : this.defaults.format);
    }, { format: 'yyyy-MM-dd HH:mm:sszzz' });
    registerFormat('iso8601', n => {
        return fmtDate(n, 'yyyy-MM-ddTHH:mm:sszzz');
    });
    registerFormat(['integer', 'int'], function (n, [group, neg], opts) {
        var _a, _b;
        return number(n, 0, (_a = group !== null && group !== void 0 ? group : opts === null || opts === void 0 ? void 0 : opts.group) !== null && _a !== void 0 ? _a : this.defaults.group, (_b = neg !== null && neg !== void 0 ? neg : opts === null || opts === void 0 ? void 0 : opts.neg) !== null && _b !== void 0 ? _b : this.defaults.neg);
    }, { group: ',', neg: 'sign' });
    registerFormat(['number', 'num'], function (n, [dec, group, neg], opts) {
        var _a, _b, _c;
        return number(n, (_a = dec !== null && dec !== void 0 ? dec : opts === null || opts === void 0 ? void 0 : opts.dec) !== null && _a !== void 0 ? _a : this.defaults.dev, (_b = group !== null && group !== void 0 ? group : opts === null || opts === void 0 ? void 0 : opts.group) !== null && _b !== void 0 ? _b : this.defaults.group, (_c = neg !== null && neg !== void 0 ? neg : opts === null || opts === void 0 ? void 0 : opts.neg) !== null && _c !== void 0 ? _c : this.defaults.neg);
    }, { dec: 2, group: ',', neg: 'sign' });
    registerFormat('ordinal', function (n, [group], opts) {
        var _a;
        return ordinal(n, (_a = group !== null && group !== void 0 ? group : opts === null || opts === void 0 ? void 0 : opts.group) !== null && _a !== void 0 ? _a : this.defaults.group);
    }, { group: ',' });
    registerFormat('phone', n => {
        return phone(n);
    });
    registerFormat('or', (n, [v]) => {
        return n || v;
    });
    registerFormat('padl', function (n, [count, val], opts) {
        var _a;
        return pad('l', n, count !== null && count !== void 0 ? count : opts === null || opts === void 0 ? void 0 : opts.len, (_a = val !== null && val !== void 0 ? val : opts === null || opts === void 0 ? void 0 : opts.pad) !== null && _a !== void 0 ? _a : this.defaults.pad);
    }, { pad: ' ' });
    registerFormat('padr', function (n, [count, val], opts) {
        var _a;
        return pad('r', n, count !== null && count !== void 0 ? count : opts === null || opts === void 0 ? void 0 : opts.len, (_a = val !== null && val !== void 0 ? val : opts === null || opts === void 0 ? void 0 : opts.pad) !== null && _a !== void 0 ? _a : this.defaults.pad);
    }, { pad: ' ' });
    registerFormat('pad', function (n, [count, val], opts) {
        var _a;
        return pad('c', n, count !== null && count !== void 0 ? count : opts === null || opts === void 0 ? void 0 : opts.len, (_a = val !== null && val !== void 0 ? val : opts === null || opts === void 0 ? void 0 : opts.pad) !== null && _a !== void 0 ? _a : this.defaults.pad);
    }, { pad: ' ' });
    registerFormat('trim', n => {
        if (!n)
            return n;
        else
            return `${n}`.trim();
    });
    {
        const space = /\s+/g;
        const br = /[\s;,.:"]\w/g;
        const alphaNum = /[^a-zA-Z0-9]+([a-zA-Z0-9])/g;
        const alphaNumSpace = /[^\sa-zA-Z0-9]/g;
        const camelBreak = /([a-z])([A-Z])/g;
        const spaceChar = /\s([^\s])/g;
        function normalize(s) {
            return s.replace(alphaNum, (_m, c) => c ? ` ${c}` : '').replace(alphaNumSpace, '').replace(camelBreak, (_m, c1, c2) => `${c1} ${c2}`).trim();
        }
        registerFormat('case', (n, whiches) => {
            let str = `${n || ''}`.trim();
            for (const which of whiches) {
                if (which === 'upper' || which === 'up')
                    str = str.toUpperCase();
                else if (which === 'lower' || which === 'down')
                    str = str.toLowerCase();
                else if (which === 'snake')
                    str = normalize(str).toLowerCase().replace(space, '_');
                else if (which === 'kebab')
                    str = normalize(str).toLowerCase().replace(space, '-');
                else if (which === 'pascal') {
                    const s = normalize(str);
                    str = s[0].toUpperCase() + s.toLowerCase().substr(1).replace(spaceChar, (_m, c) => (c || '').toUpperCase());
                }
                else if (which === 'camel') {
                    const s = normalize(str);
                    str = s[0].toLowerCase() + s.toLowerCase().substr(1).replace(spaceChar, (_m, c) => (c || '').toUpperCase());
                }
                else if (which === 'proper') {
                    if (/[a-z]/.test(str))
                        str = str.trim().replace(br, m => m.toUpperCase());
                    else
                        str = str.toLowerCase().trim().replace(br, m => m.toUpperCase());
                    str = (str[0] || '').toUpperCase() + str.substr(1);
                }
            }
            return str;
        });
    }

    exports.CSV_DEFAULTS = DEFAULTS;
    exports.PageSizes = PageSizes;
    exports.Root = Root;
    exports.applySource = applySource;
    exports.applySources = applySources;
    exports.checkType = checkType;
    exports.deepEqual = deepEqual;
    exports.detectCSV = detect;
    exports.diff = diff;
    exports.evalApply = evalApply;
    exports.evalParse = evalParse;
    exports.evalValue = evalValue;
    exports.evaluate = evaluate;
    exports.extend = extend$1;
    exports.filter = filter;
    exports.getOperator = getOperator;
    exports.getOperatorMap = getOperatorMap;
    exports.initParameters = initParameters;
    exports.inspect = inspect;
    exports.isComputed = isComputed;
    exports.isValueOrExpr = isValueOrExpr;
    exports.join = join$1;
    exports.labelDiff = labelDiff;
    exports.overlap = overlap;
    exports.parse = parse$2;
    exports.parseCSV = csv;
    exports.parseDate = parseDate;
    exports.parsePath = parsePath;
    exports.parseRange = range;
    exports.parseSchema = parseSchema;
    exports.parseTemplate = parse$1;
    exports.parseTime = parseTime;
    exports.registerFormat = registerFormat;
    exports.registerLayout = registerLayout;
    exports.registerOperator = registerOperator;
    exports.registerRenderer = registerRenderer;
    exports.run = run;
    exports.safeGet = safeGet;
    exports.similar = similar;
    exports.similarity = similarity;
    exports.stringify = stringify;
    exports.template = template;
    exports.unparseSchema = stringifySchema;
    exports.unregisterFormat = unregisterFormat;
    exports.unregisterOperator = unregisterOperator;
    exports.validate = validate;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=raport.umd.js.map
