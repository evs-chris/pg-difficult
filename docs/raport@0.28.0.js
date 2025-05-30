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
    function parser$1(parser, error) {
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
    const nop = {
        parse(_s, p, r) {
            r[0] = '';
            r[1] = p;
            return r;
        }
    };
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
    function name$1(parser, name) {
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
    const hex$1 = _hex + digits;
    const space$3 = ' \t\n\r';
    const escmap$1 = { b: '\b', r: '\r', n: '\n', "'": "'", '"': '"', t: '\t', '\\': '\\' };
    const underscores = /_/g;
    const JNum = map(seq(opt(str('-', '+')), read1(digits), read(digits + '_'), opt(str(".")), read(digits + '_'), map(opt(seq(str('e', 'E'), opt(str('+', '-')), read1(digits + '_'))), r => r && concat$1(r))), r => +(concat$1(r).replace(underscores, '')));
    const JStringEscape = map(seq(str("\\"), notchars(1, 'xu')), r => escmap$1[r[1]] || r[1]);
    const JStringUnicode = map(seq(str("\\u"), chars(4, hex$1)), r => String.fromCharCode(parseInt(r[1], 16)));
    const JStringHex = map(seq(str('\\x'), chars(2, hex$1)), r => String.fromCharCode(parseInt(r[1], 16)));
    const JString = alt(bracket(str('"'), map(rep(alt('string part', read1To('"\\'), JStringUnicode, JStringHex, JStringEscape)), r => concat$1(r)), str('"')), bracket(str('\''), map(rep(alt('string part', read1To('\'\\'), JStringUnicode, JStringHex, JStringEscape)), r => concat$1(r)), str('\'')));
    const JBool = map(str('true', 'false'), v => v === 'true');
    const JNull = map(str('null'), () => null);
    const JIdentifier = map(seq(read1(identStart), opt(read(identStart + digits))), ([s, t]) => t !== null ? s + t : s);
    const ws$2 = skip(space$3);
    const JArray = {};
    const JObject = {};
    const JValue = alt('value', JString, JArray, JObject, JNum, JBool, JNull);
    const JKeyPair = map(seq(ws$2, alt('key', JString, JIdentifier), check(ws$2, str(':'), ws$2), JValue), r => [r[1], r[3]]);
    JArray.parser = bracket(check(str('['), ws$2), repsep(JValue, check(ws$2, str(','), ws$2), 'allow'), check(ws$2, str(']')));
    JObject.parser = map(bracket(check(str('{'), ws$2), repsep(JKeyPair, check(ws$2, str(','), ws$2), 'allow'), check(ws$2, str('}'))), pairs => {
        const len = pairs.length;
        const res = {};
        for (let i = 0; i < len; i++) {
            const pair = pairs[i];
            res[pair[0]] = pair[1];
        }
        return res;
    });
    parser$1(map(seq(ws$2, JValue, ws$2), r => r[1]));

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
    const _comment = map(seq(ws$2, str('//'), opt(str(' ')), readTo('\n'), str('\n')), ([, , , c]) => ({ c }), { name: 'comment', primary: true });
    function comment(prop, p) {
        return map(seq(rep(_comment), ws$2, p), ([c, , v]) => {
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
    const inlineTemplate = {};
    const escmap = { n: '\n', r: '\r', t: '\t', b: '\b' };
    const pathesc = map(seq(str('\\'), chars(1)), ([, char]) => escmap[char] || char);
    const pathident = map(rep1(alt('ref-part', read1To(endRef, true), pathesc)), parts => parts.join(''), 'keypath-part');
    const dotpath = map(seq(str('.'), pathident), ([, part]) => part);
    const valueAnchor = map(seq(value, ws$2, opt(str('<')), ws$2, opt(seq(value, ws$2, opt(str('<'))))), ([v, , a, , s]) => {
        if (a)
            v.anchor = 'end';
        if (s) {
            const r = v;
            r.slice = s[0];
            if (s[2])
                r.slice.anchor = 'end';
        }
        return v;
    });
    const bracketpath = bracket(seq(str('['), ws$2), valueAnchor, seq(ws$2, str(']')));
    const keypath = map(seq(alt('ref-sigil', str('!', '~', '*'), seq(read('^'), opt(str('@', '.')))), alt('keypath', pathident, bracketpath), rep(alt('keypath', dotpath, bracketpath))), ([prefix, init, parts]) => {
        const res = { k: [init].concat(parts).map(p => typeof p === 'object' && 'v' in p && (typeof p.v === 'string' || typeof p.v === 'number') && !('anchor' in p) && !('slice' in p) ? p.v : p) };
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
        const res = { k: [init].concat(parts).map(p => typeof p === 'object' && 'v' in p && (typeof p.v === 'string' || typeof p.v === 'number' && !('anchor' in p) && !('slice' in p)) ? p.v : p) };
        if (prefix)
            res.u = prefix.length;
        return res;
    }, 'localpath');
    const parsePath = parser$1(keypath);
    const parseLetPath = parser$1(localpath);
    const illegalRefs = ['if', 'else', 'elif', 'elseif', 'elsif', 'fi', 'esac', 'unless', 'then', 'case', 'when', 'not', 'gte', 'gt', 'lte', 'lt', 'in', 'like', 'ilike', 'not-in', 'not-like', 'not-ilike', 'contains', 'does-not-contain', 'is-not', 'is', 'strict-is-not', 'strict-is', 'deep-is-not', 'deep-is', 'and', 'or', 'end', 'with', 'each'];
    const ref = map(keypath, (r, err) => {
        if (r.k.length === 1 && !r.p && !r.u && illegalRefs.includes(r.k[0]))
            err(`invalid reference name '${r.k[0]}'`);
        return { r };
    }, { primary: true, name: 'reference' });
    function stringInterp(parts, q) {
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
        return { op: '+', args: res, meta: q ? { q } : undefined };
    }
    const timespan = map(rep1sep(seq(JNum, ws$2, istr('years', 'year', 'y', 'months', 'month', 'minutes', 'minute', 'milliseconds', 'millisecond', 'mm', 'ms', 'm', 'weeks', 'week', 'w', 'days', 'day', 'd', 'hours', 'hour', 'h', 'seconds', 'second', 's')), ws$2), parts => {
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
    const timezone = map(seq(ws$2, alt('timezone', istr('z'), seq(opt(chars(1, '+-')), alt(chars(4, digits), chars(2, digits), chars(1, digits)), opt(seq(str(':'), chars(2, digits)))))), v => {
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
    const parseTime = parser$1(alt(map(seq(timeexact, opt(seq(ws$2, timezone))), ([tm, z]) => {
        if (z)
            tm.push(z[1]);
        return tm;
    }), timezone), { trim: true, consumeAll: true, undefinedOnError: true });
    const dateend = opt(seq(ws$2, str('>')));
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
    }), map(seq(istr('yesterday', 'today', 'tomorrow'), alt(bracket(ws$2, istr('at'), ws$2), rws), timeexact, ws$2, opt(timezone)), v => {
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
    const typelit = map(seq(str('@['), ws$2, schema(), ws$2, str(']')), ([, , v]) => ({ v, s: 1 }), { name: 'typelit', primary: true });
    const parseDate = parser$1(map(seq(opt(str('#')), alt('date', dateexact, daterel, timespan), opt(str('#'))), ([, d,]) => d), { trim: true, consumeAll: true, undefinedOnError: true });
    const string = alt({ primary: true, name: 'string' }, bracket(str('$$$'), inlineTemplate, str('$$$')), map(seq(str(':'), read1To(endSym, true)), v => ({ v: v[1] })), map(bracket(str('"""'), rep(alt('string-part', read1To('\\"'), JStringEscape, JStringUnicode, JStringHex, andNot(str('"'), str('""')))), str('"""')), a => ({ v: ''.concat(...a), q: '"""' })), map(bracket(str('"'), rep(alt('string-part', read1To('\\"'), JStringEscape, JStringUnicode, JStringHex)), str('"')), a => ({ v: ''.concat(...a) })), map(bracket(str(`'''`), rep(alt('string-part', map(read1To(`'\\$\{`, true), v => ({ v })), map(str('\\$', '$$'), () => ({ v: '$' })), bracket(str('${', '{'), value, str('}'), { primary: true, name: 'string-interpolation' }), map(str('$', '{'), v => ({ v })), map(JStringUnicode, v => ({ v })), map(JStringHex, v => ({ v })), map(JStringEscape, v => ({ v })), map(andNot(str(`'`), str(`''`)), v => ({ v })))), str(`'''`)), v => stringInterp(v, "'''")), map(bracket(str(`'`), rep(alt('string-part', map(read1To(`'\\$\{`, true), v => ({ v })), map(str('\\$', '$$'), () => ({ v: '$' })), bracket(str('${', '{'), value, str('}'), { primary: true, name: 'string-interpolation' }), map(str('$', '{'), v => ({ v })), map(JStringUnicode, v => ({ v })), map(JStringHex, v => ({ v })), map(JStringEscape, v => ({ v })))), str(`'`)), v => stringInterp(v)), map(bracket(str('```'), rep(alt('string-part', map(read1To('`\\${', true), v => ({ v })), map(str('\\$', '$$'), () => ({ v: '$' })), bracket(str('${'), value, str('}'), { primary: true, name: 'string-interpolation' }), map(str('$', '{'), v => ({ v })), map(JStringUnicode, v => ({ v })), map(JStringHex, v => ({ v })), map(JStringEscape, v => ({ v })), map(andNot(str('`'), str('``')), v => ({ v })))), str('```')), v => stringInterp(v, '```')), map(bracket(str('`'), rep(alt('string-part', map(read1To('`\\${', true), v => ({ v })), map(str('\\$', '$$'), () => ({ v: '$' })), bracket(str('${'), value, str('}'), { primary: true, name: 'string-interpolation' }), map(str('$', '{'), v => ({ v })), map(JStringUnicode, v => ({ v })), map(JStringHex, v => ({ v })), map(JStringEscape, v => ({ v })))), str('`')), v => stringInterp(v)));
    const literal = map(alt('literal', map(JNum, v => v, { primary: true, name: 'number' }), keywords, date$2), v => {
        if (v instanceof Date || v == null || typeof v !== 'object')
            return { v };
        else
            return v;
    });
    const sexp = map(bracket(check(str('('), ws$2), seq(sexprop, ws$2, args), check(ws$2, str(')'))), ([op, , args]) => {
        const res = { op };
        if (args[0] && args[0].length)
            res.args = args[0];
        if (args[1])
            res.opts = args[1];
        return res;
    }, { primary: true, name: 's-expression' });
    function fmt_op(parser) {
        return map(seq(parser, rep(seq(str('#'), ident, opt(alt(map(seq(str(','), rep1sep(value, str(','), 'allow')), ([, value]) => [value, undefined]), bracket_op(args)))), { primary: true, name: 'format-op' })), ([value, fmt]) => {
            if (!fmt || !fmt.length)
                return value;
            return fmt.reduce((a, c) => c[2] ?
                { op: 'fmt', args: [a, { v: c[1] }, ...(c[2][0] || [])], opts: c[2][1] } :
                { op: 'fmt', args: [a, { v: c[1] }] }, value);
        }, 'fmt-op');
    }
    function bracket_op(parser) {
        return bracket(seq(str('('), ws$2), parser, seq(ws$2, str(')')));
    }
    const binop = {};
    const if_op$1 = {};
    const case_op$1 = {};
    const opName = read1('abcdefghifghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_$0123456789');
    const call_op$1 = map(seq(name$1(opName, 'op'), bracket_op(args)), ([op, args]) => {
        const res = { op };
        if (args[0] && args[0].length)
            res.args = args[0];
        if (args[1])
            res.opts = args[1];
        return res;
    }, { primary: true, name: 'call' });
    const operand = fmt_op(postfix_path(alt('operand', bracket_op(application), bracket_op(if_op$1), bracket_op(case_op$1), verify(bracket_op(binop), v => 'op' in v || `expected bracketed op`), sexp, values$1)));
    const unop = map(seq(str('not ', '+', '-'), operand), ([op, arg]) => ({ op: op === 'not ' ? 'not' : op, args: [arg] }), 'unary op');
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
    const binop_e = map(seq(operand, rep(alt(seq(nop, name$1(str('**'), 'exp op'), nop, operand), seq(rws, name$1(str('**'), 'exp op'), rws, operand)))), ([arg1, more]) => more.length ? rightassoc(arg1, more) : arg1, 'exp-op');
    const binop_md = map(seq(binop_e, rep(alt(seq(nop, name$1(str('*', '/%', '/', '%'), 'muldiv-op'), nop, binop_e), seq(rws, name$1(str('*', '/%', '/', '%'), 'muldiv-op'), rws, binop_e)))), ([arg1, more]) => more.length ? more.reduce(leftassoc, arg1) : arg1, 'muldiv-op');
    const binop_as = map(seq(binop_md, rep(alt(seq(nop, name$1(str('+', '-'), 'addsub-op'), nop, binop_md), seq(rws, name$1(str('+', '-'), 'addsub-op'), rws, binop_md)))), ([arg1, more]) => more.length ? more.reduce(leftassoc, arg1) : arg1, 'addsub-op');
    const binop_cmp = map(seq(binop_as, rep(alt(seq(nop, name$1(str('>=', '>', '<=', '<'), 'cmp-op'), nop, binop_as), seq(rws, name$1(str('>=', '>', '<=', '<', 'gte', 'gt', 'lte', 'lt', 'in', 'like', 'ilike', 'not-in', 'not-like', 'not-ilike', 'contains', 'does-not-contain'), 'cmp-op'), rws, binop_as)))), ([arg1, more]) => more.length ? more.reduce(leftassoc, arg1) : arg1, 'cmp-op');
    const binop_eq = map(seq(binop_cmp, rep(alt(seq(nop, name$1(str('===', '==', '!==', '!='), 'eq-op'), nop, binop_cmp), seq(rws, name$1(str('===', '==', '!==', '!=', 'is-not', 'is', 'strict-is-not', 'strict-is', 'deep-is-not', 'deep-is'), 'eq-op'), rws, binop_cmp)))), ([arg1, more]) => more.length ? more.reduce(leftassoc, arg1) : arg1, 'eq-op');
    const binop_and = map(seq(binop_eq, rep(alt(seq(nop, name$1(str('&&'), 'and-op'), nop, binop_eq), seq(rws, name$1(str('and', '&&'), 'and-op'), rws, binop_eq)))), ([arg1, more]) => more.length ? more.reduce(leftassoc, arg1) : arg1, 'and-op');
    const binop_or = map(seq(binop_and, rep(alt(seq(nop, name$1(str('||', '??'), 'or-op'), nop, binop_and), seq(rws, name$1(str('or', '||', '??'), 'or-op'), rws, binop_and)))), ([arg1, more]) => more.length ? more.reduce(leftassoc, arg1) : arg1, 'or-op');
    binop.parser = map(binop_or, v => v, { primary: true, name: 'binary-op' });
    if_op$1.parser = alt({ primary: true, name: 'conditional' }, map(seq(str('if'), rws, value, rws, block, rep(seq(ws$2, str('else if', 'elseif', 'elsif', 'elif'), rws, value, rws, block)), opt(seq(ws$2, str('else'), rws, block))), ([, , cond1, , block1, elifs, el]) => {
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
    }, 'if'), map(seq(str('unless'), rws, value, rws, str('then'), rws, value, opt(seq(rws, str('else'), rws, value)), opt(seq(rws, str('end')))), ([, , cond, , , , hit, miss]) => {
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
    const pair = map(seq(alt('key', string, map(ident, v => ({ v }))), ws$2, str(':'), ws$2, value), t => [t[0], t[4]], 'pair');
    array.parser = map(bracket(check(str('['), ws$2), repsep(value, read1(space$2 + ','), 'allow'), check(ws$2, str(']'))), args => args.filter(a => !('v' in a)).length ? { op: 'array', args } : { v: args.map(a => a.v) }, { primary: true, name: 'array' });
    function objectOp(pairs) {
        return pairs.filter(p => !('v' in p[0] && 'v' in p[1])).length ?
            { op: 'object', args: pairs.reduce((a, c) => (a.push(c[0], c[1]), a), []) } :
            { v: pairs.reduce((a, c) => (a[c[0].v] = c[1].v, a), {}) };
    }
    object.parser = map(bracket(check(str('{'), ws$2), repsep(pair, read1(space$2 + ','), 'allow'), check(ws$2, str('}'))), objectOp, { primary: true, name: 'object' });
    block.parser = map(bracket(check(str('{'), ws$2), rep1sep(value, read1(space$2 + ';'), 'allow'), check(ws$2, str('}'))), args => ({ op: 'block', args }), { primary: true, name: 'block' });
    value.parser = unwrap(comment('c', operation));
    const namedArg = map(seq(ident, str(':'), ws$2, value), ([k, , , v]) => [{ v: k }, v], 'named-arg');
    application.parser = map(seq(opt(bracket(check(str('|'), ws$2), rep1sep(opName, read1(space$2 + ','), 'allow'), seq(str('|'), ws$2))), str('=>', '=\\'), ws$2, value), ([names, , , value]) => {
        const res = { a: value };
        if (names)
            res.n = names;
        if ('op' in value && value.op === 'block') {
            value.opts = Object.assign({}, value.opts, { v: { implicit: 1 } });
        }
        return res;
    }, { primary: true, name: 'application' });
    args.parser = map(repsep(alt('argument', namedArg, value), read1(space$2 + ','), 'allow'), (args) => {
        const [plain, obj] = args.reduce((a, c) => ((Array.isArray(c) ? a[1].push(c) : a[0].push(c)), a), [[], []]);
        if (obj.length)
            return [plain, objectOp(obj)];
        return [plain, undefined];
    });
    const letter = map(seq(str('let'), rws, name$1(localpath, { name: 'reference', primary: true }), ws$2, str('='), ws$2, value), ([, , k, , , , v]) => ({ op: 'let', args: [{ v: k }, v] }), { primary: true, name: 'let' });
    const setter = map(seq(str('set'), rws, name$1(keypath, { name: 'reference', primary: true }), ws$2, str('='), ws$2, value), ([, , k, , , , v]) => ({ op: 'set', args: [{ v: k }, v] }), { primary: true, name: 'set' });
    values$1.parser = alt('expression', array, object, literal, typelit, string, application, unop, call_op$1, letter, setter, ref, block);
    const parseBlock = parser$1(map(rep1sep(value, read1(space$2 + ';'), 'allow'), args => args.length === 1 ? args[0] : { op: 'block', args, opts: { v: { implicit: 1 } } }, 'expression-sequence'), { trim: true });
    const parseExpr = parser$1(value, { trim: true });
    parseBlock.namespace = 'default';
    const parse$3 = parseBlock;
    function schema() {
        const type = {};
        const conditions = opt(seq(ws$2, rep1sep(map(seq(name$1(str('?'), { name: 'condition', primary: true }), ws$2, application), ([, , a]) => a), rws, 'disallow')));
        const value = map(seq(str('any[]', 'string[]', 'number[]', 'boolean[]', 'date[]', 'any', 'string', 'number', 'boolean', 'date'), not(read1To(endRef))), ([s]) => ({ type: s === 'any[]' ? 'array' : s }), { name: 'type', primary: true });
        const typedef = comment('c', map(seq(str('type'), ws$2, name$1(ident, { name: 'type', primary: true }), ws$2, str('='), ws$2, type), ([, , name, , , , type]) => ({ name, type })));
        const typedefs = map(rep1sep(typedef, read1(' \t\n;'), 'allow'), defs => defs.reduce((a, c) => (c.type.desc = c.c, a[c.name] = c.type, a), {}));
        const ref = map(seq(ident, opt(str('[]'))), ([ref, arr]) => ({ type: arr ? 'array' : 'any', ref }), { name: 'type', primary: true });
        const key = map(seq(name$1(ident, { name: 'key', primary: true }), opt(str('?')), ws$2, str(':'), ws$2, type), ([name, opt, , , , type]) => {
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
        const rest = map(seq(str('...'), ws$2, str(':'), ws$2, type), ([, , , , type]) => {
            return Object.assign({ name: '...' }, type);
        });
        const object = map(seq(str('{'), ws$2, repsep(comment('desc', alt('interface parts', key, rest)), read1(' \t\n,;'), 'allow'), ws$2, str('}'), opt(str('[]'))), ([, , keys, , , arr], fail) => {
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
        const tuple = map(seq(str('['), ws$2, repsep(type, read1(' \t\r\n,'), 'allow'), ws$2, str(']'), opt(str('[]'))), ([, , types, , , arr]) => {
            return { type: arr ? 'tuple[]' : 'tuple', types };
        });
        const maybe_union = {};
        const union_array = {};
        maybe_union.parser = map(rep1sep(seq(alt('union', value, object, tuple, literal, union_array, ref), conditions), seq(ws$2, str('|'), ws$2), 'disallow'), list => {
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
        union_array.parser = alt('union array', map(seq(str('Array<'), ws$2, maybe_union, ws$2, str('>')), ([, , union], fail) => {
            if (union.type === 'union')
                return { type: 'union[]', types: union.types };
            else if (union.type === 'literal')
                fail('literal types cannot be array types');
            else if (union.type === 'array' || ~union.type.indexOf('[]'))
                return { type: 'union[]', types: [union] };
            else if (union.type === 'any')
                return { type: 'array' };
            else {
                union.type += '[]';
                return union;
            }
        }), map(seq(str('('), ws$2, maybe_union, ws$2, str(')')), ([, , union]) => union));
        type.parser = map(seq(maybe_union, conditions), ([type, checks]) => {
            if (checks && checks[1] && checks[1].length)
                type.checks = checks[1];
            return type;
        });
        const root = map(seq(opt(typedefs), ws$2, type), ([defs, , type]) => {
            if (defs)
                type.defs = defs;
            return type;
        });
        return root;
    }

    const endTxt$1 = '\\{';
    const txtEsc = alt(map(str('\\{{'), () => '{{'), map(seq(str('\\'), chars(1)), ([, c]) => c));
    const text$1 = map(rep1(alt(read1To(endTxt$1, true), txtEsc, andNot(str('{'), str('{')))), txts => ({ v: txts.join('') }), 'text');
    const nestedText = map(rep1(alt(read1To(endTxt$1 + '$'), txtEsc, andNot(str('$'), str('$$')), andNot(str('{'), str('{')))), txts => ({ v: txts.join('') }), 'text');
    function tag_value(names) {
        return map(seq(str('{{'), ws$2, str(...names), rws, value, ws$2, str('}}')), arr => [arr[2], arr[4]], 'tag');
    }
    function case_value(names) {
        return map(seq(str('{{'), ws$2, str(...names), rws, value, rws, str('when'), rws, value, str('}}')), arr => [arr[2], arr[4], arr[8]], 'tag');
    }
    const tag_end = name$1(check(seq(str('{{/'), readTo('}'), str('}}'))), 'tag end');
    const content$1 = {};
    function branch(names, value) {
        if (value)
            return map(tag_value(names), ([name, value]) => ({ name, value }));
        else
            return map(seq(str('{{'), ws$2, str(...names), ws$2, str('}}')), ([, , name]) => ({ name }), 'tag');
    }
    function min_one(values) {
        return map(values, v => v.length < 1 ? [{ v: '' }] : v);
    }
    const else_tag = branch(['else']);
    const branch_tag = branch(['else if', 'elseif', 'elsif', 'elif'], true);
    const each_op = map(seq(tag_value(['each']), min_one(rep(alt(branch_tag, else_tag, content$1))), tag_end), ([tag, content]) => ({ op: 'each', args: [tag[1]].concat(apply_first(cond_branches(content))) }), { primary: true, name: 'each-block' });
    const if_op = map(seq(tag_value(['if']), min_one(rep(alt(branch_tag, else_tag, content$1))), tag_end), ([tag, content]) => ({ op: 'if', args: [tag[1]].concat(cond_branches(content)) }), { primary: true, name: 'if-block' });
    const with_op = map(seq(tag_value(['with']), min_one(rep(alt(else_tag, content$1))), tag_end), ([tag, content]) => ({ op: 'with', args: [tag[1]].concat(apply_first(cond_branches(content))) }), { primary: true, name: 'with-block' });
    const unless_op = map(seq(tag_value(['unless']), min_one(rep(content$1)), tag_end), ([tag, content]) => ({ op: 'unless', args: [tag[1]].concat(concat(content)) }), { primary: true, name: 'unless-block' });
    const case_op = map(seq(case_value(['case']), min_one(rep(alt(branch(['when'], true), else_tag, content$1))), tag_end), ([tag, content]) => {
        const op = { op: 'case', args: tag.slice(1).concat(cond_branches(content)) };
        for (let i = 1; i < op.args.length; i += 2) {
            const arg = op.args[i];
            if (typeof arg === 'object' && 'op' in arg)
                replaceCase(arg);
        }
        return op;
    }, { primary: true, name: 'case-block' });
    const interpolator = map(seq(str('{{'), ws$2, value, ws$2, str('}}')), ([, , value]) => ({ op: 'string', args: [value] }), { primary: true, name: 'interpolator' });
    content$1.parser = alt({ primary: true, name: 'content' }, text$1, each_op, if_op, with_op, case_op, unless_op, interpolator);
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
        return { op: 'cat', args: values, meta: { q: '$$$' } };
    }
    const _parse$1 = parser$1(alt(map(rep1(content$1), args => concat(args)), map(ws$2, () => ({ v: '' }))), { trim: true });
    _parse$1.namespace = 'template';
    const parse$2 = _parse$1;
    inlineTemplate.parser = map(rep1(alt({ name: 'inline-template' }, nestedText, each_op, if_op, with_op, case_op, unless_op, interpolator)), args => concat(args));

    function toDataSet(value) {
        if (Array.isArray(value))
            return { value };
        if (value && typeof value === 'object') {
            for (const k in value)
                if (k !== 'schema' && k !== 'value')
                    return { value };
            return value;
        }
        return { value };
    }
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
                let first = parts[0];
                if (typeof first === 'object' && 'v' in first)
                    first = first.v;
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
                if (o != null && typeof v === 'number' && typeof part === 'object' && typeof o.length === 'number') {
                    if ('slice' in part && part.slice && typeof part.slice === 'object') {
                        let start = 'anchor' in part && part.anchor === 'end' ? o.length - 1 - v : v;
                        if (start < 0)
                            start = 0;
                        if (start > o.length - 1)
                            start = o.length - 1;
                        const e = typeof part.slice !== 'object' ? part : evalValue(root, part.slice);
                        let end = 'anchor' in part.slice && part.slice.anchor === 'end' ? o.length - 1 - e : e;
                        if (end < 0)
                            end = 0;
                        if (end > o.length - 1)
                            end = o.length - 1;
                        const dir = start > end ? -1 : 1;
                        let res = typeof o === 'string' ? '' : [];
                        for (let i = start; i !== end + dir; i += dir)
                            typeof res === 'string' ? res = res + o[i] : res.push(o[i]);
                        o = res;
                    }
                    else if ('anchor' in part && part.anchor === 'end') {
                        o = o[o.length - 1 - v];
                    }
                    else {
                        o = o[v];
                    }
                }
                else if (Array.isArray(v) && o && typeof o === 'object') {
                    const r = {};
                    for (const f of v)
                        if (f in o)
                            r[f] = o[f];
                    o = r;
                }
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
                let key = keys[i];
                const part = parts[i];
                if (o != null && typeof key === 'number' && typeof part === 'object' && 'anchor' in part && part.anchor === 'end' && typeof o.length === 'number')
                    key = o.length - key;
                const next = keys[i + 1];
                if (!(key in o) || o[key] == null)
                    o[key] = typeof next === 'number' ? [] : {};
                o = o[key];
            }
            if (o) {
                const part = parts[last];
                let k = keys[last];
                if (o != null && typeof k === 'number' && typeof part === 'object' && 'anchor' in part && part.anchor === 'end' && typeof o.length === 'number')
                    k = o.length - 1 - k;
                const cur = o[k];
                o[k] = value;
                return cur;
            }
        }
    }
    function evaluate(root, value) {
        let r;
        let e;
        if (!value && isValueOrExpr(root)) {
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
        else if (root && typeof root !== 'string') {
            r = new Root(root);
            t = template || '';
        }
        else {
            r = new Root();
            t = root;
        }
        r = extend$1(r, { parser: parse$2 });
        return evalParse(r, t);
    }
    /**
     * Evaluate an applicative with the given locals, naming them if the applicative declares named arguments.
     * If swap is not true, then a new context extension will be used. Otherwise, the context locals will be
     * swapped for the evaluation and replaced afterwards. Swap should only be used for applications that are
     * passing the context value as the first local.
     */
    function evalApply(ctx, value, locals, special) {
        if (isApplication(value)) {
            const c = extend$1(ctx, { value: locals[0], special, fork: !ctx.locals });
            let res;
            if ('n' in value) {
                const map = value.n.reduce((a, c, i) => (a[c] = locals[i], a), {});
                c.locals = map;
            }
            res = evalValue(c, value.a);
            return res;
        }
        else {
            const v = evalParse(extend$1(ctx, { value: locals[0], special, fork: !ctx.locals }), value);
            if (isApplication(v))
                return evalApply(ctx, v, locals, special);
            else
                return v;
        }
    }
    function evalParse(ctx, expr) {
        if (typeof expr === 'string') {
            const p = ctx.parser || parse$3;
            const ns = p.namespace || 'unknown';
            const cache = ctx.root.exprs[ns] || (ctx.root.exprs[ns] = {});
            expr = cache[expr] || (cache[expr] = p(expr));
        }
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
    const _defaultGetValue = (c, b, v) => evalApply(c, b, [v]);
    function sort(context, arr, sorts, getValue) {
        let sortArr;
        if (Array.isArray(sorts)) {
            sortArr = sorts;
        }
        else if (isApplication(sorts)) {
            sortArr = [sorts];
        }
        else if (typeof sorts === 'object' && sorts && 'by' in sorts) {
            sortArr = [sorts];
        }
        else {
            const s = evalParse(context, sorts);
            if (Array.isArray(s))
                sortArr = s;
            else if (typeof s === 'string')
                sortArr = [{ v: s }];
            else if (typeof sorts === 'string')
                sortArr = [sorts];
        }
        if (sortArr) {
            let el;
            for (let i = 0; i < sortArr.length; i++) {
                el = sortArr[i];
                const by = isLiteral(el) ? el.v : el;
                if (typeof by === 'string') {
                    if (by[0] === '-')
                        sortArr[i] = { by: by.slice(1), desc: true };
                    else
                        sortArr[i] = { by: by[0] === '+' ? by.slice(1) : by, desc: false };
                }
            }
        }
        getValue = getValue || _defaultGetValue;
        if (sortArr && sortArr.length) {
            const dirs = sortArr.map(s => {
                if (typeof s === 'object') {
                    if ('by' in s) {
                        if ('desc' in s) {
                            if (typeof s.desc === 'boolean')
                                return s.desc;
                            return evalParse(context, s.desc);
                        }
                        else if ('dir' in s) {
                            const lower = typeof s.dir === 'string' ? s.dir.toLowerCase() : s.dir;
                            const dir = lower === 'asc' || lower === 'desc' ? lower : evalParse(context, s.dir);
                            const val = typeof dir === 'string' ? dir.toLowerCase() : dir;
                            if (val === 'desc')
                                return true;
                        }
                    }
                }
                // default to asc
                return false;
            });
            arr.sort((a, b) => {
                for (let i = 0; i < sortArr.length; i++) {
                    const s = sortArr[i];
                    const desc = dirs[i];
                    const by = typeof s === 'string' ? s : s && s.by ? s.by : s;
                    const l = getValue(context, by, a);
                    const r = getValue(context, by, b);
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
        return arr;
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
            let flt = typeof filter === 'string' ? parse$3(filter) : filter;
            if ('m' in flt)
                flt = { v: true };
            _ds.value.forEach((row, index) => {
                if (!!evalApply(extend$1(_context, { value: row, special: { value: row, index } }), flt, [row, index]))
                    values.push(row);
            });
        }
        if (sorts)
            sort(_context, values, sorts);
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
                return evalApply(root, local, (operation.args || []).map(a => evalParse(root, a)));
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
                if (opts.log && typeof opts.log === 'function')
                    this.log = opts.log;
            }
        }
        log(v) {
            console.log(...v);
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
            parent: opts.fork && (!opts.value || opts.value === context.value) ? (context.parent || context.root) : context,
            root: context.root,
            path: opts.path || '',
            value: 'value' in opts ? opts.value : context.value,
            special: opts.fork ? Object.assign({}, context.special, { pipe: undefined }, opts.special) : (opts.special || {}),
            parser: opts.parser,
            locals: opts.locals,
        };
    }
    const formats = {};
    const virtualFormats = {};
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
                a.setFullYear(tmp2);
                a.setMonth(tmp1 + 2);
                a.setDate(0);
            }
            else {
                a.setDate(num);
                a.setMonth(tmp1 + 1);
                if (tmp1 === 11 ? a.getMonth() !== 0 : a.getMonth() !== tmp1 + 1) {
                    a.setDate(1);
                    a.setFullYear(tmp2);
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
    function error(context, placement, message = 'Widget overflow error') {
        addStyle(context, 'error', `.error { position: absolute; box-sizing: border-box; color: red; border: 1px dotted; width: 100%; height: 2rem; padding: 0.5rem; }`);
        return { output: `<div class="error" style="top: ${placement.y}rem;">${message}</div>`, height: 2 };
    }

    function isComputed(v) {
        return v && typeof v === 'object' && isValueOrExpr(v.x);
    }
    function maybeComputed(v, context) {
        if (!isComputed(v))
            return v;
        else if (v.x)
            return evaluate(context, v.x);
    }
    function extend(context, opts) {
        return { parent: context, report: context.report, context: extend$1(context.context, opts), styles: context.styles, styleMap: context.styleMap, commit: opts.commit };
    }
    const htmlChars = /[><&]/g;
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
        const line = (font && maybeComputed(font.line, context)) || size;
        const brw = font && 'break-word' in font ? font['break-word'] : true;
        const avg = (((font && maybeComputed(font.metric, context)) || ((family === 'mono' || /fixed|mono/i.test(family) ? avgs.mono :
            family === 'narrow' || /narrow|condensed/i.test(family) ? avgs.narrow :
                family === 'sans' || /sans|arial|helvetica/i.test(family) ? avgs.sans :
                    avgs.serif))) * size) / 16;
        const lines = text.split(/\r?\n/g);
        return lines.reduce((a, c) => {
            const [word, lines] = c.split(/\s|-/g).reduce((a, c) => {
                const wlen = (c.length + 1) * avg;
                if (a[0] + wlen > width) {
                    if (a[0] === 0 || wlen > width) {
                        if (brw) {
                            a[0] = (wlen - (width - a[0])) % width;
                            if (wlen > width)
                                a[1] += Math.floor(wlen / width);
                        }
                        a[1]++;
                    }
                    else {
                        a[0] = wlen;
                        a[1]++;
                    }
                }
                else {
                    a[0] += wlen;
                }
                return a;
            }, [0, 0]);
            return a + ((lines + (word > 0 ? 1 : 0)) || 1);
        }, 0) * line;
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
        if (placement.maxY && !isNaN(h) && h > placement.maxY)
            return error(context, placement);
        if (placement.availableY != null && h > placement.availableY)
            return { output: '', continue: { offset: 0 }, cancel: true };
        let extraHeight = 0;
        if (w.margin) {
            const m = expandMargin(w, context, placement);
            extraHeight += m[0] + m[2];
            if (placement.availableY != null)
                placement.availableY -= m[0] + m[2];
        }
        if (w.border && !h && w.box === 'expand') {
            const b = expandBorder(w, context, placement);
            extraHeight += b[0] + b[2];
            if (placement.availableY != null)
                placement.availableY -= b[0] + b[2];
        }
        const r = renderer.render(w, context, placement, state);
        if (typeof r === 'string')
            return { output: r, height: h, width: getWidthWithMargin(w, placement, context) };
        if (typeof r.height === 'number')
            r.height = +r.height.toFixed(6);
        if (typeof r.width === 'number')
            r.width = +r.width.toFixed(6);
        if (placement.availableY != null)
            placement.availableY = +placement.availableY.toFixed(6);
        if (placement.maxY && r.height > placement.maxY)
            return error(context, placement);
        if (isNaN(h) && placement.availableY != null && r.height > placement.availableY)
            return { output: '', continue: { offset: 0 }, height: r.height || 0, cancel: true };
        r.height = r.height || 0;
        r.height += extraHeight;
        r.height = +(r.height.toFixed(6));
        return r;
    }
    const layouts = {};
    function registerLayout(name, layout) {
        layouts[name] = layout;
    }
    registerLayout('row', (w, o, m, p, ps, context) => {
        let n;
        let br = isComputed(w.br) ? evaluate(extend$1(context.context, { special: { placement: p, widget: w } }), w.br.x) : w.br;
        let availableX = p.maxX - ps[0][0] - ps[0][2] + ps[ps.length - 1][0];
        if (availableX <= 0) {
            availableX = p.maxX;
            br = true;
        }
        if (br || ps[0][0] + ps[0][2] + getWidthWithMargin(w, { x: p.x, y: p.y, maxX: p.maxX, maxY: p.maxY, availableY: p.availableY, availableX }, context) - ps[ps.length - 1][0] > p.maxX) {
            n = { x: m[3], y: maxYOffset(ps), availableX: p.maxX, maxX: p.maxX };
            n.availableY = p.availableY - (n.y - o);
        }
        else {
            n = { x: ps[0][0] + ps[0][2], y: ps[0][1], availableX, maxX: p.maxX, availableY: p.availableY };
        }
        n.y -= o;
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
            // placement starts with availableY shrunk for margins, so offset y by the top margin
            const yo = m[0] || 0;
            if (widget.border && widget.box === 'expand') {
                const b = expandBorder(widget, context, placement);
                if (placement.availableX != null)
                    placement.availableX -= b[1] + b[3];
                if (placement.availableY != null)
                    placement.availableY -= b[0] + b[2];
            }
            for (let i = state && state.last || 0; i < widget.widgets.length; i++) {
                let w = widget.widgets[i];
                if (w.macro)
                    w = expandMacro(w.macro, w, context, placement, state);
                if (w.hide && evaluate(extend$1(context.context, { special: { widget: w, placement } }), w.hide))
                    continue;
                // allow widgets that are taller than max height to be dropped
                let h = placement && getHeightWithMargin(w, placement, context);
                if (h > placement.maxY)
                    h = 1;
                if (placement && placement.availableY != null && h > placement.availableY) {
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
                        p.availableX = p.maxX;
                    if (!layout || typeof layout === 'string') {
                        const l = layout ? layouts[layout] || layouts.row : layouts.row;
                        p = l(w, offset, m, placement, ps, context);
                        if (h > p.availableY) {
                            if (w.height === 'grow')
                                h = getHeightWithMargin(w, p, context);
                            if (h > p.availableY) {
                                const offset = maxYOffset(ps);
                                state = state || { offset };
                                state.last = i;
                                return { output: s, continue: state, height: offset };
                            }
                        }
                    }
                    p.maxX = p.maxX || placement.maxX;
                    p.maxY = p.maxY || placement.maxY;
                    if (p.x < 0) {
                        p.offsetX = m[3];
                        p.x = (placement.availableX || 1) + p.x - getWidthWithMargin(w, placement, context) + 1;
                    }
                    if (p.y < 0) {
                        p.offsetY = m[0];
                        if (placement.availableY == null)
                            p.y = 0;
                        else
                            p.y = (placement.availableY || 1) + p.y - h + 1;
                    }
                    const { x, y } = p;
                    const r = renderWidget(w, context, p, state && state.child);
                    // skip empty output
                    if (typeof r === 'string' && !r || (!r.cancel && !r.output && !r.continue && !r.height))
                        continue;
                    if (typeof r === 'string') {
                        s += r;
                        ps.unshift([x, y, getWidthWithMargin(w, placement, context), getHeightWithMargin(w, placement, context)]);
                    }
                    else {
                        if (r.cancel)
                            return { output: '', cancel: true };
                        const h = r.height || getHeightWithMargin(w, placement, context) || 0;
                        if (y - yo + h > placement.availableY) {
                            const offset = maxYOffset(ps);
                            state = state || { offset };
                            state.last = i;
                            state.attempt = (+state.attempt || 0) + 1;
                            if (state.attempt > 1)
                                return error(context, placement);
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
        if (typeof width === 'number' && (w.box === 'contain' || (pct || width === placement.availableX) && w.box !== 'expand')) {
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
                const t = w.text[i];
                if (typeof t === 'object' && 'font' in t && t.font && t.font.size > n)
                    n = t.font.size;
            }
        }
        return n;
    }
    function getHeight(w, placement, context, computed, linesize) {
        let r = 1;
        let h = isComputed(w.height) ? evaluate(extend$1(context.context, { special: { widget: w, placement, computed, linesize } }), w.height.x) : w.height;
        const m = w.margin && expandMargin(w, context, placement);
        const b = w.border && expandBorder(w, context, placement);
        let pct = false;
        if (h == null && linesize)
            h = maxFontSize(w);
        if (typeof h === 'number')
            r = h;
        else if (h && typeof h === 'object' && 'percent' in h && h.percent && placement.maxY) {
            r = +(placement.maxY * (h.percent / 100)).toFixed(4);
            pct = true;
        }
        else if (h === 'grow') {
            r = placement.availableY || 0;
        }
        else if (h === 'auto' || typeof h === 'string' || (h == null && w.type === 'container') || (computed && !h)) {
            if (b && w.box === 'expand')
                return computed + b[0] + b[2] || NaN;
            return computed || NaN;
        }
        if (typeof r === 'number' && (w.box === 'contain' || (pct || r === placement.availableY) && w.box !== 'expand')) {
            if (m)
                r -= m[0] + m[2];
        }
        return r;
    }
    function getHeightWithMargin(w, placement, context, computed, linesize) {
        let h = getHeight(w, placement, context, computed, linesize);
        if (typeof h === 'number' && w.margin) {
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
    function expandBorder(w, context, placement) {
        let b = w.border;
        let res = [0, 0, 0, 0];
        if (typeof b === 'string' || (b && !Array.isArray(b) && typeof b === 'object' && ('v' in b || 'r' in b || 'op' in b)))
            b = evaluate(extend$1(context.context, { special: { widget: w, placement } }), b);
        if (typeof b === 'number')
            res = [0, 0, b, 0];
        else if (Array.isArray(b)) {
            if (b.length === 1)
                res = [b[0], b[0], b[0], b[0]];
            else if (b.length === 2)
                res = [b[0], b[1], b[0], b[1]];
            else if (b.length === 3)
                res = [b[0], b[1], b[2], b[1]];
            else if (b.length >= 4)
                res = [b[0], b[1], b[2], b[3]];
        }
        else if (b && typeof b === 'object')
            res = [b.top || 0, b.right || 0, b.bottom || 0, b.left || 0];
        for (let i = 0; i < 4; i++)
            res[i] = res[i] * 0.0625;
        return res;
    }
    function expandMacro(macro, w, ctx, placement, state) {
        const res = evaluate(extend$1(ctx.context, { special: { widget: w, placement, state } }), macro);
        if (res && !Array.isArray(res) && typeof res === 'object') {
            if ('content' in res || 'props' in res || 'properties' in res)
                w = Object.assign({}, w, res.props, res.properties, { widgets: Array.isArray(res.content) ? res.content : res.content ? [res.content] : w.widgets, macro: undefined });
            else if ('replace' in res && res.replace && typeof res.replace === 'object' && 'type' in res.replace)
                return res.replace;
            else
                w = Object.assign({}, w, { widgets: [res], macro: undefined });
        }
        else if (Array.isArray(res))
            w = Object.assign({}, w, { widgets: res, macro: undefined });
        return w;
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
    function style$1(w, placement, context, opts) {
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
        if (line != null || size != null)
            s += `line-height: ${line !== null && line !== void 0 ? line : size}rem;`;
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
            s += styleBorder(w, context, placement);
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
            s += `white-space:pre-wrap;word-break:break-word;`;
        const pre = t;
        if (t = maybeComputed(f.clamp, context))
            s += `${pre ? '' : 'white-space:nowrap;'}overflow:hidden;`;
        return s;
    }
    function styleBorder(w, context, placement) {
        const b = expandBorder(w, context, placement);
        if (b[0] + b[1] + b[2] + b[3])
            return `border-style:solid;border-width:${b[0]}rem ${b[1]}rem ${b[2]}rem ${b[3]}rem;`;
        return '';
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
            return runDelimited(report, ctx, { table: extra === null || extra === void 0 ? void 0 : extra.table });
        else if (extra === null || extra === void 0 ? void 0 : extra.delimited)
            return runAsDelimited(report, ctx, extra);
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
                base = evaluate(extend$1(context, { value: base.value, special: { source: base } }), source.base);
            srcs[source.name || source.source] = toDataSet(base);
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
            context.sources[source.name || source.source] = toDataSet(base);
    }
    function runDelimited(report, context, options) {
        const source = context.root.sources[report.source ? report.source : (report.sources[0].name || report.sources[0].source)];
        const values = Array.isArray(source.value) ?
            source.value :
            typeof source.value === 'object' && 'grouped' in source.value && Array.isArray(source.value.all) ? // watch out for grouped sources
                source.value.all :
                [source.value];
        let fields = report.fields;
        let headers = report.headers;
        if ((!fields || !fields.length) && values.length && typeof values[0] === 'object' && values[0]) {
            fields = Object.keys(values[0]);
            if (Array.isArray(values[0]))
                fields = fields.map(i => `_.${i}`);
            else if (!headers || !headers.length)
                headers = Object.keys(values[0]);
        }
        if (!fields)
            fields = [];
        let res = '';
        if (headers) {
            const ctx = extend$1(context, { parser: parse$2 });
            if (options === null || options === void 0 ? void 0 : options.table)
                res += `<thead><tr><th class=index></th>${headers.map(h => `<th>${evaluate(ctx, h)}</th>`).join('')}</tr></thead>`;
            else
                res += headers.map(h => `${report.quote || ''}${evaluate(ctx, h)}${report.quote || ''}`).join(report.field || ',') + (report.record || '\n');
        }
        if (options === null || options === void 0 ? void 0 : options.table) {
            res += '<tbody>';
            let idx = 1;
            for (const value of values) {
                const c = extend$1(context, { value, special: { index: idx - 1 } });
                if (report.rowContext) {
                    if (!c.locals)
                        c.locals = {};
                    const v = evaluate(c, report.rowContext);
                    if (v)
                        c.value = v;
                }
                res += `<tr><th class=index>${idx}</th>${fields.map(f => {
                let val = f ? evaluate(c, f) : '';
                if (val === undefined)
                    val = '';
                if (typeof val !== 'string') {
                    const v = val;
                    val = `${v}`;
                    if (val.slice(0, 7) === '[object')
                        val = JSON.stringify(v);
                }
                return `<td>${val}</td>`;
            }).join('')}</tr>`;
                idx++;
            }
            res += '</tbody>';
            res = `<table>${res}</table>`;
        }
        else {
            const unquote = report.quote ? new RegExp(report.quote, 'g') : undefined;
            let index = 0;
            for (const value of values) {
                const c = extend$1(context, { value, special: { index } });
                if (report.rowContext) {
                    if (!c.locals)
                        c.locals = {};
                    const v = evaluate(c, report.rowContext);
                    if (v)
                        c.value = v;
                }
                res += fields.map(f => {
                    let val = f ? evaluate(c, f) : '';
                    if (val === undefined)
                        val = '';
                    if (typeof val !== 'string') {
                        const v = val;
                        val = `${v}`;
                        if (val.slice(0, 7) === '[object')
                            val = JSON.stringify(v);
                    }
                    if (unquote)
                        val = val.replace(unquote, report.quote + report.quote);
                    return `${report.quote || ''}${val}${report.quote || ''}`;
                }).join(report.field || ',') + (report.record || '\n');
                index++;
            }
        }
        return res;
    }
    function runPage(report, context, extras) {
        var _a, _b, _c, _d, _e, _f, _g;
        let size = report.orientation !== 'portrait' ? { width: report.size.height, height: report.size.width, margin: [report.size.margin[1], report.size.margin[0]] } : report.size;
        const ctx = { context, report, styles: {}, styleMap: { ids: {}, styles: {} } };
        const margin = expandMargin(report, ctx, { x: 0, y: 0 });
        context.special = context.special || {};
        context.special.page = 0;
        context.special.pages = 0;
        const pages = [''];
        let page = 0;
        const printX = size.width - 2 * size.margin[1];
        const printY = size.height - 2 * size.margin[0];
        let availableY = printY - margin[0] - margin[2];
        const pageY = availableY;
        let maxY = availableY;
        let y = 0;
        const availableX = printX - margin[1] - margin[3];
        let state = null;
        let headSize = 0;
        if (report.header) {
            const r = renderWidget(report.header, ctx, { x: 0, y: 0, availableX, availableY, maxX: availableX, maxY });
            headSize = r.height;
            if (!((_a = report.header) === null || _a === void 0 ? void 0 : _a.outer)) {
                availableY -= headSize;
                maxY -= headSize;
                y += headSize;
            }
        }
        let footSize = 0;
        if (report.footer) {
            const r = renderWidget(report.footer, ctx, { x: 0, y: 0, availableX, availableY, maxX: availableX, maxY });
            footSize = r.height;
            if (!((_b = report.footer) === null || _b === void 0 ? void 0 : _b.outer)) {
                availableY -= footSize;
                maxY -= footSize;
            }
        }
        for (let w of report.widgets || []) {
            if (w.macro)
                w = expandMacro(w.macro, w, ctx, { x: 0, y: 0, availableX, availableY, maxX: availableX, maxY }, state);
            let r;
            do {
                context.special.page = page + 1;
                r = renderWidget(w, ctx, { x: 0, y, availableX, availableY, maxX: availableX, maxY }, state);
                pages[page] += r.output;
                if (r.continue) {
                    page++;
                    pages[page] = '';
                    y = ((_c = report.header) === null || _c === void 0 ? void 0 : _c.outer) ? 0 : headSize;
                    availableY = printY - (((_d = report.header) === null || _d === void 0 ? void 0 : _d.outer) ? 0 : headSize) - (((_e = report.footer) === null || _e === void 0 ? void 0 : _e.outer) ? 0 : footSize) - margin[0] - margin[2];
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
        const footPlace = ((_f = report.footer) === null || _f === void 0 ? void 0 : _f.outer) ?
            { x: 0, y: printY - footSize, maxX: printX, maxY: printY } :
            { x: 0 + margin[3], y: printY - margin[0] - footSize, maxX: printX - margin[3] - margin[1], maxY: printY - margin[0] - margin[2] };
        const headPlace = ((_g = report.header) === null || _g === void 0 ? void 0 : _g.outer) ?
            { x: 0, y: 0, maxX: printX, maxY: printY } :
            { x: 0 + margin[3], y: margin[0], maxX: printX - margin[3] - margin[1], maxY: printY - margin[0] - margin[2] };
        context.special.size = { x: availableX, y: pageY };
        pages.forEach((p, i) => {
            let n = `<div class="page-back pb${i}"><div${styleClass(ctx, ['page', `ps${i}`], ['', ''], '', 'p')}>\n`;
            context.special.page = i + 1;
            if (report.watermark) {
                const r = renderWidget(report.watermark, ctx, { x: 0, y: 0, maxX: printX, availableX: printX, maxY: printY, availableY: printY });
                n += r.output + '\n';
            }
            if (report.header) {
                const r = renderWidget(report.header, ctx, headPlace);
                n += r.output + '\n';
            }
            n += `<div class="page-inner">${p}</div>`;
            if (report.footer) {
                const r = renderWidget(report.footer, ctx, footPlace);
                n += r.output + '\n';
            }
            if (report.overlay) {
                const r = renderWidget(report.overlay, ctx, { x: 0, y: 0, maxX: printX, availableX: printX, maxY: printY, availableY: printY });
                n += r.output + '\n';
            }
            n += '\n</div></div>';
            pages[i] = n;
        });
        return `<html style="font-size:100%;margin:0;padding:0;"><head><style>
    .page { width: ${printX}rem; height: ${printY}rem; position: absolute; overflow: hidden; left: ${size.margin[1]}rem; top: ${size.margin[0]}rem; ${report.font ? styleFont(report.font, ctx) : ''} }
    .page-inner { position: absolute; width: ${printX - margin[1] - margin[3]}rem; height: ${printY - margin[0] - margin[2]}rem; left: ${margin[3]}rem; top: ${margin[0]}rem; }
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
        if (report.width)
            width = report.width;
        else if (report.size)
            width = report.orientation !== 'portrait' ? report.size.height : report.size.width;
        let margin;
        if (report.margin != null)
            margin = expandMargin(report, ctx, { x: 0, y: 0, availableX: width, maxX: width });
        if (!margin && report.size && report.size.margin)
            margin = expandMargin(report.size, ctx, { x: 0, y: 0, availableX: width, maxX: width });
        if (!margin)
            margin = [0, 0, 0, 0];
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
        for (const w of report.widgets || [])
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
    .page-back { ${width ? `width: ${width}rem; ` : 'width: 100%; box-sizing: border-box; '}padding: ${margin[0] || 0}rem ${margin[1] || 0}rem ${margin[2] || 0}rem ${margin[3] || 0}rem; position: absolute; left: 0; top: 0; }
    #wrapper { height:${maxY}rem; position: relative; ${report.font ? styleFont(report.font, ctx) : ''} }
    .watermark { z-index: 0; }
    .main { z-index: 5; }
    .overlay { z-index: 10; }
    @media screen {
      body { margin: 1rem${width ? ' auto' : ''}; background-color: #fff; box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.4); padding: ${margin[0]}rem ${margin[1]}rem ${margin[2]}rem ${margin[3]}rem !important; }
    }${Object.entries(ctx.styles).map(([_k, v]) => v).join('\n')}${Object.entries(ctx.styleMap.styles).map(([style, id]) => `.${id} { ${style} }`).join('\n')}
  </style>${extras && extras.head || ''}</head><body>\n<div class=page-back><div id=wrapper>${html}</div></div>${extras && extras.foot || ''}</body></html>`;
    }
    function findWidgets(from, type, first, results) {
        results = results || [];
        if (from.type === type)
            results.push(from);
        if (first && results.length)
            return results;
        if (from.widgets)
            for (const w of from.widgets)
                findWidgets(w, type, first, results);
        return results;
    }
    // TODO: this could try harder to carry context forward and use non-named sources if it seems necessary
    function runAsDelimited(report, context, extra) {
        var _a;
        const [repeater] = findWidgets({ type: 'container', widgets: report.widgets }, 'repeater', true);
        if (repeater && typeof ((_a = repeater === null || repeater === void 0 ? void 0 : repeater.source) === null || _a === void 0 ? void 0 : _a.source) === 'string') {
            let headers;
            let fields;
            const rowContext = repeater.row.context;
            if (repeater.header) {
                const labels = findWidgets(repeater.header, 'label');
                headers = labels.map(l => typeof l.text === 'string' ? parse$3(l.text) : l.text);
            }
            fields = findWidgets(repeater.row, 'label').map(l => l.text);
            const source = '_tmp';
            if (typeof repeater.source === 'object') {
                const src = repeater.source;
                let data;
                if ('source' in src) {
                    const s = src;
                    let base = context.sources[s.source] || { value: [] };
                    if (s.base)
                        base = { value: evaluate(extend$1(context, { value: base.value, special: { source: base } }), s.base) };
                    if (s.filter || s.sort || s.group)
                        base = filter(base, s.filter, s.sort, s.group, context);
                    data = toDataSet(base);
                }
                else
                    data = toDataSet(evaluate(context, src));
                context.sources._tmp = data;
            }
            return runDelimited(Object.assign({ type: 'delimited', headers, fields, source, rowContext }, extra), context, (extra === null || extra === void 0 ? void 0 : extra.table) ? { table: true } : {});
        }
        return '';
    }

    // zero width space
    const zwsp = '&#8203;';
    const sp = read1(' \r\n\t');
    const ws$1 = read(' \r\n\t');
    const hex = '0123456789abcdef';
    const integer = map(read1('0123456789'), v => +v);
    const number$1 = map(seq(opt(str('-')), read1('0123456789'), opt(seq(str('.'), read1('0123456789')))), ([m, n, d]) => +[m, n, d === null || d === void 0 ? void 0 : d[0], d === null || d === void 0 ? void 0 : d[1]].filter(v => v).join(''));
    const color = map(seq(opt(str('#')), alt(chars(8, hex), chars(6, hex), chars(4, hex), chars(3, hex))), ([, color]) => `#${color}`);
    const remOrPercent = map(seq(number$1, opt(str('%'))), ([n, p]) => `${n}${p ? '%' : 'rem'}`);
    const places = str('left', 'right', 'top', 'bottom', 'center');
    const align = map(seq(str('align'), opt(seq(str('='), alt(seq(str('top', 'middle', 'bottom', 'base'), opt(seq(sp, str('left', 'right', 'center')))), seq(str('left', 'right', 'center'), opt(seq(sp, str('top', 'middle', 'bottom', 'base')))))))), ([, v]) => { var _a; return ({ tag: 'align', value: v ? [v[1][0], (_a = v[1][1]) === null || _a === void 0 ? void 0 : _a[1]].filter(v => v) : null }); });
    const valign = map(seq(str('valign'), opt(seq(str('='), str('top', 'middle', 'bottom', 'base')))), ([, v]) => ({ tag: 'valign', value: v ? v[1] : null }));
    const pad$1 = map(seq(str('pad'), opt(seq(str('='), rep1sep(number$1, sp)))), ([, v]) => ({ tag: 'pad', value: v ? v[1] : null }));
    const margin = map(seq(str('margin'), opt(seq(str('='), rep1sep(number$1, sp)))), ([, v]) => ({ tag: 'margin', value: v ? v[1] : null }));
    const width = map(seq(str('width', 'w'), opt(seq(str('='), remOrPercent))), ([, v]) => ({ tag: 'width', value: v ? v[1] : null }));
    const height = map(seq(str('height', 'h'), opt(seq(str('='), remOrPercent))), ([, v]) => ({ tag: 'height', value: v ? v[1] : null }));
    const line = map(seq(str('line'), opt(seq(str('='), number$1))), ([, v]) => ({ tag: 'line', value: v ? v[1] : null }));
    const fg = map(seq(str('fg', 'color', 'fore'), opt(seq(str('='), color))), ([, v]) => ({ tag: 'fg', value: v ? v[1] : null }));
    const bg = map(seq(str('bg', 'background', 'back'), opt(seq(str('='), color))), ([, v]) => ({ tag: 'bg', value: v ? v[1] : null }));
    const size = map(seq(str('size'), opt(seq(str('='), number$1))), ([, v]) => ({ tag: 'size', value: v ? v[1] : null }));
    const font = map(seq(str('font'), opt(seq(str('='), read1To(',|')))), ([, v]) => ({ tag: 'font', value: v ? v[1] : null }));
    const rotate = map(seq(str('rotate'), opt(seq(str('='), number$1, ws$1, opt(str('left', 'right')), opt(seq(sp, alt(remOrPercent, places), sp, alt(remOrPercent, places)))))), ([, v]) => ({ tag: 'rotate', value: v ? { turn: v[1] * (v[3] === 'left' ? -1 : 1), origin: v[4] ? [v[4][1], v[4][3]] : undefined } : null }));
    const move = map(seq(str('move'), opt(seq(str('='), remOrPercent, sp, remOrPercent))), ([, v]) => ({ tag: 'move', value: v ? { x: v[1], y: v[3] } : null }));
    const trash = map(readTo(',|'), v => ({ tag: 'trash', value: v }));
    const border = map(seq(str('border'), opt(seq(str('='), opt(str('solid', 'dot', 'dash', 'double')), ws$1, rep1sep(integer, sp), ws$1, opt(seq(str('/'), ws$1, rep1sep(number$1, sp))), ws$1, opt(color)))), ([, v]) => { var _a; return ({ tag: 'border', value: v ? { style: v[1] || 'solid', width: v[3], radius: (_a = v[5]) === null || _a === void 0 ? void 0 : _a[2], color: v[7] } : null }); });
    const bools = map(alt(str('sub', 'sup', 'bold', 'italic', 'underline', 'strike', 'overline', 'overflow', 'nowrap', 'pre', 'br', 'b', 'i', 'u')), tag => ({ tag }));
    const tag = map(seq(str('|'), ws$1, rep1sep(alt(border, align, fg, bg, valign, size, line, font, pad$1, margin, width, height, bools, rotate, move, trash), seq(ws$1, str(','), ws$1), 'allow'), readTo('|'), str('|')), ([, , tags]) => tags.filter(t => t.tag !== 'trash'));
    const text = map(rep1(alt(read1To('\\|', true), map(str('\\|'), () => '|'))), txts => txts.join(''));
    const all = rep(alt(text, tag));
    const parser = parser$1(all, { consumeAll: true, undefinedOnError: true });
    const blocks = ['border', 'width', 'height', 'pad', 'margin', 'align', 'overflow', 'nowrap', 'rotate', 'move'];
    const aliases = {
        b: 'bold',
        i: 'italic',
        u: 'underline',
    };
    function process(stuff) {
        let res = '';
        let open = false;
        const state = { bool: {}, value: {} };
        const blockstack = [];
        for (const s of stuff) {
            if (typeof s === 'string') {
                if (!state.bool.pre && /^\s/.test(s))
                    res += zwsp;
                res += s;
                if (!state.bool.pre && /\s$/.test(s))
                    res += zwsp;
            }
            else {
                let drop = false;
                let block;
                for (const style of s) {
                    const tag = aliases[style.tag] || style.tag;
                    if ('value' in style) {
                        if (style.value !== null) {
                            (state.value[tag] || (state.value[tag] = [])).push(style.value);
                            if (blocks.includes(tag) || block && tag === 'bg')
                                (block || (block = [])).push(tag);
                        }
                        else {
                            if (blocks.includes(tag))
                                drop = true;
                            else if (tag === 'bg' && (drop || blockstack && blockstack.length && blockstack[blockstack.length - 1].includes('bg')))
                                drop = true;
                            else
                                (state.value[tag] || (state.value[tag] = [])).pop();
                        }
                    }
                    else {
                        if (tag === 'br')
                            res += '<br/>';
                        else if (blocks.includes(tag) && block.length)
                            block.push(tag);
                        else
                            state.bool[tag] = !state.bool[tag];
                    }
                }
                if (open)
                    res += `</span>`;
                open = true;
                if (drop) {
                    const frame = blockstack.pop();
                    if (frame) {
                        res += '</span>';
                        for (const b of frame)
                            (state.value[b] || (state.value[b] = [])).pop();
                    }
                }
                if (block) {
                    blockstack.push(block);
                    res += `<span style="${getStyle(state, block)}">`;
                }
                res += `<span style="${getStyle(state, 'inline')}">`;
            }
        }
        if (open)
            res += `</span>`;
        for (const f of blockstack)
            res += '</span>';
        return res;
    }
    function style(str) {
        const parsed = parser(str);
        if (Array.isArray(parsed))
            return process(parsed);
        return str;
    }
    const flexAlign = { top: 'start', middle: 'center', bottom: 'end', base: 'baseline' };
    const borderStyle = { dot: 'dotted', dash: 'dashed' };
    function getStyle(state, which) {
        let res = '';
        if (which === 'inline') {
            const bs = state.bool;
            if (bs.underline || bs.overline || bs.strike)
                res += `text-decoration-line:${[bs.underline && 'underline', bs.overline && 'overline', bs.strike && 'line-through'].filter(v => v).join(' ')};`;
            if (bs.sup || bs.sub) {
                res += `font-size:70%;`;
                if (bs.sup)
                    res += `vertical-align:super;`;
                if (bs.sub)
                    res += `vertical-align:sub;`;
            }
            if (bs.italic)
                res += `font-style:italic;`;
            if (bs.bold)
                res += `font-weight:bold;`;
            if (bs.pre)
                res += `white-space:pre-wrap;`;
            const vs = state.value;
            if (Array.isArray(vs.valign)) {
                const v = vs.valign[vs.valign.length - 1];
                if (v)
                    res += `vertical-align:${v === 'base' ? 'baseline' : v};`;
            }
            if (Array.isArray(vs.fg)) {
                const v = vs.fg[vs.fg.length - 1];
                if (v)
                    res += `color:${v};`;
            }
            if (Array.isArray(vs.bg)) {
                const v = vs.bg[vs.bg.length - 1];
                if (v)
                    res += `background-color:${v};`;
            }
            if (Array.isArray(vs.size)) {
                const v = vs.size[vs.size.length - 1];
                if (v != null)
                    res += `font-size:${v}rem;`;
            }
            if (Array.isArray(vs.font)) {
                const v = vs.font[vs.font.length - 1];
                if (v != null)
                    res += `font-family:${v};`;
            }
            if (Array.isArray(vs.line)) {
                const v = vs.line[vs.line.length - 1];
                if (v != null)
                    res += `line-height:${v}rem;`;
            }
        }
        else {
            res += `display:inline-flex;box-sizing:content-box;overflow:hidden;`;
            const vs = state.value;
            let transforms;
            if (which.includes('align') && Array.isArray(vs.align)) {
                const v = vs.align[vs.align.length - 1];
                if (Array.isArray(v)) {
                    let vv = v.find(v => ['top', 'middle', 'bottom', 'base'].includes(v));
                    if (vv)
                        res += `align-items:${flexAlign[vv]};`;
                    vv = v.find(v => ['left', 'right', 'center'].includes(v));
                    if (vv)
                        res += `justify-content:${vv};`;
                }
            }
            if (which.includes('width') && Array.isArray(vs.width)) {
                const v = vs.width[vs.width.length - 1];
                if (v != null)
                    res += `width:${v};`;
            }
            if (which.includes('height') && Array.isArray(vs.height)) {
                const v = vs.height[vs.height.length - 1];
                if (v != null)
                    res += `height:${v};`;
            }
            if (which.includes('pad') && Array.isArray(vs.pad)) {
                const v = vs.pad[vs.pad.length - 1];
                if (Array.isArray(v) && v.length) {
                    res += `padding:${v[0]}rem`;
                    if (v.length > 1)
                        res += ` ${v[1]}rem`;
                    if (v.length > 2)
                        res += ` ${v[2]}rem`;
                    if (v.length > 3)
                        res += ` ${v[3]}rem`;
                    res += ';';
                }
            }
            if (which.includes('margin') && Array.isArray(vs.margin)) {
                const v = vs.margin[vs.margin.length - 1];
                if (Array.isArray(v) && v.length) {
                    res += `margin:${v[0]}rem`;
                    if (v.length > 1)
                        res += ` ${v[1]}rem`;
                    if (v.length > 2)
                        res += ` ${v[2]}rem`;
                    if (v.length > 3)
                        res += ` ${v[3]}rem`;
                    res += ';';
                }
            }
            if (which.includes('border') && Array.isArray(vs.border)) {
                const v = vs.border[vs.border.length - 1];
                if (v) {
                    res += `border-style:${borderStyle[v.style] || v.style};border-width:${v.width[0]}px`;
                    if (v.width.length > 1)
                        res += ` ${v.width[1]}px`;
                    if (v.width.length > 2)
                        res += ` ${v.width[2]}px`;
                    if (v.width.length > 3)
                        res += ` ${v.width[3]}px`;
                    res += ';';
                    if (v.color)
                        res += `border-color:${v.color};`;
                    if (v.radius) {
                        res += `border-radius:${v.radius[0]}rem`;
                        if (v.radius.length > 1)
                            res += ` ${v.radius[1]}rem`;
                        if (v.radius.length > 2)
                            res += ` ${v.radius[2]}rem`;
                        if (v.radius.length > 3)
                            res += ` ${v.radius[3]}rem`;
                        res += ';';
                    }
                }
            }
            if (which.includes('bg') && Array.isArray(vs.bg)) {
                const v = vs.bg[vs.bg.length - 1];
                if (v)
                    res += `background-color:${v};`;
            }
            if (which.includes('rotate') && Array.isArray(vs.rotate)) {
                const v = vs.rotate[vs.rotate.length - 1];
                if (v) {
                    if (v.origin)
                        res += `transform-origin:${v.origin[0]} ${v.origin[1]};`;
                    (transforms || (transforms = []))[which.indexOf('rotate')] = `rotate(${v.turn}turn)`;
                }
            }
            if (which.includes('move') && Array.isArray(vs.move)) {
                const v = vs.move[vs.move.length - 1];
                if (v)
                    (transforms || (transforms = []))[which.indexOf('move')] = `translate(${v.x}, ${v.y})`;
            }
            if (transforms)
                res += `transform:${transforms.filter(v => v).join(' ')};`;
            if (which.includes('nowrap'))
                res += `white-space:nowrap;`;
            if (which.includes('overflow'))
                res += `overflow:visible;`;
        }
        return res;
    }

    function onCommit(ctx, key, value) {
        let c = ctx;
        while (c) {
            if (c.commit) {
                c.commit[key] = value;
                return;
            }
            c = c.parent;
        }
    }
    function commitContext(ctx) {
        for (const k in ctx.commit) {
            let l = ctx.context;
            while (l) {
                if (l.special && l.special.values)
                    (l.special.values[k] || (l.special.values[k] = [])).push(ctx.commit[k]);
                l = l.parent;
            }
        }
    }
    registerRenderer('label', (w, ctx, placement) => {
        addStyle(ctx, 'label', `.label {position:absolute;box-sizing:border-box;white-space:normal;}`);
        let str = '';
        let sval;
        let val = (Array.isArray(w.text) ? w.text : [w.text]).map(v => {
            let val = evaluate(ctx, typeof v === 'object' && 'text' in v ? v.text : v);
            if (typeof val === 'string')
                val = escapeHTML(val);
            if (typeof v === 'object' && 'id' in v)
                onCommit(ctx, v.id, val);
            str += val;
            sval = val;
            if (w.styled)
                val = style(val);
            if (typeof v === 'object' && 'text' in v) {
                return `<span${styleClass(ctx, [], [styleFont(v.font, ctx) + styleExtra(v, ctx), ''])}>${val}</span>`;
            }
            else {
                return val;
            }
        }).join('');
        if (w.id)
            onCommit(ctx, w.id, str);
        if (w.format && w.format.name) {
            const args = [{ v: !Array.isArray(w.text) || w.text.length === 1 ? sval : val }, { v: w.format.name }];
            val = evaluate(ctx, { op: 'format', args: args.concat(w.format.args || []) });
        }
        return `<span${styleClass(ctx, ['label'], style$1(w, placement, ctx, { lineSize: true }))}>${val}</span>`;
    });
    registerRenderer('container', (w, ctx, placement, state) => {
        addStyle(ctx, 'container', `.container {position:absolute;box-sizing:border-box;}`);
        let h;
        if (!w.height)
            w.height = 'auto';
        else if (w.height !== 'auto')
            h = getHeightWithMargin(w, placement, ctx);
        const wctx = ((state || {}).state || {}).ctx ? Object.assign({}, ctx, { context: state.state.ctx }) : ctx;
        if (w.context && !((state || {}).state || {}).ctx) {
            if (!wctx.context.locals)
                wctx.context.locals = {};
            const value = evaluate(extend(wctx, { special: { placement, widget: w }, locals: wctx.context.locals }), w.context);
            if (value)
                wctx.context = extend$1(wctx.context, { value, special: { placement, widget: w } });
        }
        const cw = getWidth(w, placement, ctx) || placement.availableX;
        const r = renderWidgets(w, wctx, { x: 0, y: 0, availableX: cw, availableY: h || placement.availableY, maxX: cw, maxY: h != null && !isNaN(h) ? h : placement.maxY }, state, w.layout);
        if (!r.cancel) {
            r.output = `<div${styleClass(ctx, ['container'], style$1(w, placement, ctx, { computedHeight: h || r.height, container: true }))}>${r.output}</div>`;
            r.height = h || r.height;
            r.width = getWidthWithMargin(w, placement, ctx);
        }
        if ((r.cancel || r.continue) && !w.bridge) {
            const state = r.continue || {};
            state.offset = 0;
            // must start over
            delete state.last;
            state.attempt = (state.attempt || 0) + 1;
            if (state.attempt > 1)
                return error(ctx, placement);
            return { continue: state, output: '' };
        }
        else if (r.continue) {
            if (w.context)
                r.continue.state = { ctx: wctx.context };
            r.continue.offset = 0;
        }
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
        if (availableY != null) {
            availableY -= y;
            availableY = +availableY.toFixed(6);
        }
        let group;
        let groupNo = false;
        const newPage = state && state.state && state.state.newPage;
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
        if ((w.header || w.group) && (newPage || !state || !state.state || state.state.part === 'header' || state.state.part === 'group')) {
            const hctx = state && state.state && state.state.context && state.state.context.context;
            if (group) {
                const c = extend(ctx, { special: { source: group && group.grouped ? group.all : arr, level: group && group.level, grouped: groupNo !== false, group: group && group.group, values: (hctx && hctx.special || {}).values } });
                if (w.group && groupNo !== false && (!state || !state.state || state.state.part === 'group')) {
                    r = renderWidget(w.group[groupNo], extend(ctx, { value: group, special: { source: group && group.grouped ? group.all : arr, level: group && group.level, grouped: true, group: group.group } }), { x: 0, y, availableX: placement.availableX, maxX: placement.maxX, maxY: placement.maxY });
                    if (r) {
                        if (r.height > availableY) {
                            if (html)
                                html = `<div${styleClass(ctx, ['container', 'repeat'], style$1(w, placement, ctx, { computedHeight: y, container: true }))}>\n${html}</div>`;
                            return { output: html, height: y, continue: { offset: 0, state: { part: 'group', src, current: 0, newPage: true } } };
                        }
                        else if (availableY != null) {
                            availableY -= r.height;
                            availableY = +availableY.toFixed(6);
                        }
                        html += r.output;
                        y += r.height;
                    }
                }
                if (w.header && (w.groupHeaders && w.groupHeaders[group.grouped] && (!state || !state.state || !state.state.current) || newPage && w.headerPerPage !== false))
                    r = renderWidget(w.header, c, { x: 0, y, availableX: placement.availableX, maxX: placement.maxX, maxY: placement.maxY });
                else
                    r = { output: '', height: 0 };
                if (r.height > availableY)
                    return { output: `<div${styleClass(ctx, ['container', 'repeat'], style$1(w, placement, ctx, { computedHeight: y, container: true }))}>\n${html}</div>`, height: y, continue: { offset: y, state: { part: 'header', src, current: 0, context: ctx, newPage: true } } };
                else if (availableY != null) {
                    availableY -= r.height;
                    availableY = +availableY.toFixed(6);
                }
                html += r.output;
                y += r.height;
            }
            else if (w.header) {
                if (!state || newPage && w.headerPerPage !== false)
                    r = renderWidget(w.header, ctx, { x: 0, y, availableX: placement.availableX, maxX: placement.maxX, maxY: placement.maxY });
                else
                    r = { output: '', height: 0 };
                if (r.height > availableY)
                    return { output: `<div${styleClass(ctx, ['container', 'repeat'], style$1(w, placement, ctx, { computedHeight: y, container: true }))}>\n${html}</div>`, height: y, continue: { offset: y, state: { part: 'header', src, current: 0, context: ctx, newPage: true } } };
                else if (availableY != null) {
                    availableY -= r.height;
                    availableY = +availableY.toFixed(6);
                }
                html += r.output;
                y += r.height;
            }
        }
        if (newPage)
            state.state.newPage = false;
        if (state && state.child && state.child.state)
            state.child.state.newPage = false;
        let rctx = state && state.state && state.state.context || extend(ctx, { special: { source: group && group.grouped ? group.all : arr, level: group && group.level, grouped: groupNo !== false, group: group && group.group, values: {}, last: arr.length - 1, count: arr.length } });
        const elide = w.row && (isComputed(w.row.elide) ? evaluate(extend(rctx, { special: { placement, widget: w } }), w.row.elide.x) : w.row.elide);
        if (!state || !state.state || state.state.part !== 'footer') {
            let usedX = 0;
            let usedY = 0;
            let initY = y;
            if (!elide && !arr.length && w.alternate) {
                if (w.alternate) {
                    r = renderWidget(w.alternate, rctx, { x: usedX, y, availableX: availableX - usedX, maxX: placement.maxX, availableY, maxY: placement.maxY }, state ? state.child : undefined);
                    if (r.height > availableY)
                        return { output: html, height: 0, continue: { offset: 0, state: { part: 'body', src, current: 0, newPage: true } } };
                    else if (availableY != null) {
                        availableY -= r.height;
                        availableY = +availableY.toFixed(6);
                    }
                    html += r.output;
                    y += r.height;
                }
            }
            else {
                for (let i = (state && state.state && state.state.current) || 0; i < arr.length; i++) {
                    let row = false;
                    const c = group && group.grouped ?
                        extend(rctx, { value: arr[i], special: { index: i, values: {} }, commit: {} }) :
                        extend(rctx, { value: arr[i], special: { index: i } });
                    if (group && group.grouped) {
                        const s = (state && state.child) || { offset: 0, state: { current: 0, src: arr[i], part: 'group' } };
                        r = renderWidget(w, c, { x: 0, y, availableX: availableX - usedX, availableY, maxX: placement.maxX, maxY: placement.maxY }, s);
                    }
                    else {
                        c.commit = {};
                        if (elide) {
                            renderWidget(w.row, c, { x: 0, y: 0, availableX: placement.maxX, maxX: placement.maxX, availableY: placement.maxY, maxY: placement.maxY }, state ? state.child : undefined);
                            commitContext(c);
                            continue;
                        }
                        else {
                            r = renderWidget(w.row, c, { x: usedX, y, availableX: availableX - usedX, maxX: placement.maxX, availableY, maxY: placement.maxY }, state ? state.child : undefined);
                            row = true;
                        }
                    }
                    if (state)
                        state.child = null;
                    if (r.width && r.width <= availableX - usedX && r.width !== availableX) {
                        usedX += r.width;
                        if (r.height > usedY) {
                            usedY = r.height;
                            if (r.height > availableY)
                                initY -= r.height;
                        }
                    }
                    else if (r.width && usedX && r.width > availableX - usedX) {
                        y += usedY;
                        initY = y;
                        if (availableY != null) {
                            availableY -= usedY;
                            availableY = +availableY.toFixed(6);
                        }
                        usedY = 0;
                        usedX = 0;
                        i--;
                        continue;
                    }
                    if (r.height > availableY || r.cancel) {
                        if (initY === y && usedY)
                            y += usedY;
                        if (commit)
                            return { output: `<div${styleClass(ctx, ['container', 'repeat'], style$1(w, placement, ctx, { computedHeight: y, container: true }))}>\n${html}</div>`, height: y, continue: { offset: y, state: { part: 'body', src, current: i, context: rctx, newPage: !group || groupNo === false }, child: r.continue } };
                        else
                            return { output: '', height: y, continue: { offset: y, state: { part: state && state.state && state.state.part || 'body', src, current: i, context: rctx, newPage: !group || groupNo === false }, child: r.continue } };
                    }
                    if (!usedY) {
                        y += r.height;
                        if (availableY != null) {
                            availableY -= r.height;
                            availableY = +availableY.toFixed(6);
                        }
                    }
                    html += r.output;
                    commit = true;
                    if (row && w.header && ctx.report.type === 'flow' && w.headerRepeat > 0 && i + 1 && (i + 1) % w.headerRepeat === 0) {
                        const h = renderWidget(w.header, ctx, { x: 0, y, availableX: placement.availableX, maxX: placement.maxX, maxY: placement.maxY });
                        html += h.output;
                        y += h.height;
                    }
                    if (r.continue) {
                        if (initY === y && usedY)
                            y += usedY;
                        if (w.row.bridge)
                            commitContext(c);
                        return { output: `<div${styleClass(ctx, ['container', 'repeat'], style$1(w, placement, ctx, { computedHeight: y, container: true }))}>\n${html}</div>`, height: y, continue: { offset: y, state: { part: 'body', src, current: i, context: rctx, newPage: !group || groupNo === false }, child: w.row.bridge || (group && group.grouped) ? r.continue : undefined } };
                    }
                    commitContext(c);
                }
            }
            if (initY === y && usedY)
                y += usedY;
        }
        if (w.footer) {
            const fctx = (rctx && rctx.context) || (state && state.state && state.state.context && state.state.context.context);
            const c = extend(ctx, { special: { source: group && group.grouped ? group.all : arr, level: group && group.level, grouped: groupNo !== false, group: group && group.group, values: (fctx && fctx.special || {}).values }, commit: {} });
            if (group) {
                if (w.groupEnds && w.groupEnds[group.grouped])
                    r = renderWidget(w.footer, c, { x: 0, y, availableX: placement.availableX, maxX: placement.maxX, maxY: placement.maxY, availableY });
                else
                    r = { output: '', height: 0 };
            }
            else
                r = renderWidget(w.footer, c, { x: 0, y, availableX: placement.availableX, maxX: placement.maxX, maxY: placement.maxY, availableY });
            if (r.height > availableY)
                return { output: `<div${styleClass(ctx, ['container', 'repeat'], style$1(w, placement, ctx, { computedHeight: y, container: true }))}>\n${html}</div>`, height: y, continue: { offset: y, state: { part: 'footer', current: 0, src, context: rctx, newPage: true } } };
            else if (r.continue) {
                if (w.footer.bridge)
                    commitContext(c);
                return { output: `<div${styleClass(ctx, ['container', 'repeat'], style$1(w, placement, ctx, { computedHeight: y, container: true }))}>\n${html}</div>`, height: y, continue: { offset: y, state: { part: 'footer', src, current: 0, context: rctx, newPage: true }, child: w.footer.bridge ? r.continue : undefined } };
            }
            commitContext(c);
            html += r.output;
            y += r.height;
        }
        return { output: `<div${styleClass(ctx, ['container', 'repeat'], style$1(w, placement, ctx, { computedHeight: y, container: true }))}>\n${html}</div>`, height: y };
    }, { container: true });
    registerRenderer('image', (w, ctx, placement) => {
        addStyle(ctx, 'image', `.image {position:absolute;box-sizing:border-box;} .image .inner {background-repeat:no-repeat;height:100%;}`);
        const fit = w.fit && typeof w.fit === 'object' ? evaluate(ctx, w.fit.x) : w.fit;
        if (fit === 'stretch') {
            return `<img src="${evaluate(ctx, w.url)}" ${styleClass(ctx, ['image'], style$1(w, placement, ctx))} />`;
        }
        else {
            return `<div ${styleClass(ctx, ['image'], style$1(w, placement, ctx))}><div ${styleClass(ctx, ['inner'], styleImage(fit), `background-image:url('${evaluate(ctx, w.url)}');`)}></div></div>`;
        }
    });
    registerRenderer('measured', (w, ctx, placement, state) => {
        addStyle(ctx, 'measured', `.measured {position:absolute;box-sizing:border-box;white-space:pre-wrap;font-family:serif;font-size:0.83rem;word-break:break-word;}`);
        const text = evaluate(ctx, w.text);
        const height = measure(text, getWidth(w, placement, ctx) || placement.availableX, ctx, w.font);
        if (!state && height > placement.availableY) {
            return { output: '', height: 0, continue: { state: {}, offset: 0 } };
        }
        else {
            let s = style$1(w, placement, ctx, { computedHeight: height, container: true });
            s[0] = `line-height:1em;` + s[0];
            return {
                height, output: `<span${styleClass(ctx, ['measured', 'label'], s)}>${escapeHTML(text)}</span>`
            };
        }
    });
    registerRenderer('html', (w, ctx, placement) => {
        addStyle(ctx, 'html', `.html {position:absolute;box-sizing:border-box;overflow:hidden;line-height:1rem;}`);
        const html = evaluate(extend(ctx, { parser: parse$2 }), w.html);
        return `<div${styleClass(ctx, ['html'], style$1(w, placement, ctx, { container: true }))}>${html}</div>`;
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
        if (!v)
            v = '';
        if (typeof v !== 'string')
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
    const dateRE = /\\.|y+|M+|d+|E+|H+|m+|s+|k+|h+|a+|S+|z+/g;
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
            if (m[0] === '\\') {
                return m[1];
            }
            else if (m[0] === 'y') {
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
                _listwrap = Object.keys(_listwrap).reduce((a, c) => (a[c] = c in o && o[c] != null ? (!o[c] ? 0 : o[c] === true ? 1 : o[c]) : b, a), {});
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
        if (typeof value === 'string')
            return value;
        let stringed;
        if (value == null || typeof value === 'number' || typeof value === 'boolean')
            return `${value}`;
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
                else {
                    const v = p;
                    return `[${_stringify(p)}${v.anchor === 'end' ? '<' : ''}${v.slice ? ` ${_stringify(v.slice)}${v.slice.anchor === 'end' ? '<' : ''}` : ''}]`;
                }
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
        var _a, _b;
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
            if (value.meta && value.meta.q) {
                const re = new RegExp(`(\\{|${value.meta.q})`, 'g');
                return `${value.meta.q}${args.map(a => typeof a !== 'string' && 'v' in a && typeof a.v === 'string' ? a.v.replace(re, v => `\\$1`).replace(/\$$/, '\\$') : `{${_stringify(a)}}`).join('')}${value.meta.q}`;
            }
            else
                return `'${args.map(a => typeof a !== 'string' && 'v' in a && typeof a.v === 'string' ? a.v.replace(/[{']/g, v => `\\${v}`).replace(/\$$/, '\\$') : `{${_stringify(a)}}`).join('')}'`;
        }
        else if ((op === 'fmt' || op === 'format') && value.args && typeof value.args[1] === 'object' && 'v' in value.args[1] && typeof value.args[1].v === 'string') {
            const val = value.args[0];
            let vs = _stringify(val);
            if (typeof val !== 'string' && 'op' in val && (binops.includes(val.op) || unops.includes(val.op)))
                vs = `(${vs})`;
            if (value.opts || ((_a = value.args) === null || _a === void 0 ? void 0 : _a.length) > 3)
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
        else if (op === 'cat' && ((_b = value.meta) === null || _b === void 0 ? void 0 : _b.q) === '$$$') {
            return `$$$${stringifyTemplate(value.args)}$$$`;
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
            else if (value.q)
                return `${value.q}${value.v.replace(new RegExp(value.q, 'g'), `\\${value.q}`)}${value.q}`;
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
                return wrapArgs('(array', value.v.map(v => ({ v })), null, ')', null, 'array');
            return wrapArgs('[', value.v.map(v => ({ v })), null, ']', null, 'array');
        }
        else if (typeof value.v === 'object') {
            if (isDateRel(value.v)) {
                return stringifyDate(value.v);
            }
            else {
                return wrapArgs('{', Object.entries(value.v).reduce((a, c) => (a.push({ v: c[0] }, { v: c[1] }), a), []), null, '}', 2, 'keys');
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
    function wrapArgs(open, args, opts, close, keyMod, wrapSetting) {
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
        let wrap = _listwrap[wrapSetting || 'args'];
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
    function stringifyTemplate(parts) {
        const start = _tpl;
        _tpl = true;
        const res = parts.map(p => _stringify(p)).join('');
        _tpl = start;
        return res;
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

    const parseSchema = parser$1(map(seq(opt(str('@[')), ws$2, schema(), ws$2, opt(str(']'))), ([, , schema]) => schema), { trim: true, consumeAll: true });

    const space$1 = ' \t\r\n';
    const num$2 = map(seq(opt(str('-')), read1(digits)), ([neg, num]) => neg ? -num : +num);
    const num_range = map(seq(num$2, str('-', ':'), num$2), ([start, , end]) => [start, end].sort((l, r) => l < r ? -1 : l > r ? 1 : 0));
    const sign_range = map(seq(str('<', '>'), ws$2, num$2), ([sign, , num]) => sign === '<' ? [-Infinity, num - 1] : [num + 1, Infinity]);
    const star_range = map(str('*'), () => [-Infinity, Infinity]);
    const not_range = map(seq(str('!'), alt(num_range, sign_range, num$2)), ([, range]) => ({ not: range }));
    const _range = rep1sep(alt(star_range, num_range, sign_range, num$2, not_range), read1(space$1 + ',;'), 'allow');
    const range = parser$1(_range, { trim: true });

    function join(...strs) {
        return strs.filter(s => s).join('.');
    }
    const looseEqual = (v1, v2) => v1 == v2;
    const strictEqual = (v1, v2) => v1 === v2;
    const isNum$1 = /^[\d.]+$/;
    const trueStrings = /^(true|on|yes)$/i;
    const falseStrings = /^(false|off|no)$/i;
    const sqlEqual = (v1, v2) => {
        var _a, _b;
        let tmp1, tmp2;
        if ((typeof v1 === 'number' || typeof v1 === 'string' && isNum$1.test(v1)) && (typeof v2 === 'number' || typeof v2 === 'string' && isNum$1.test(v2))) {
            return +v1 === +v2;
        }
        else if ((typeof v1 === 'boolean' || typeof v2 === 'boolean') && (typeof v1 === 'string' || typeof v2 === 'string')) {
            return trueStrings.test(v1) && trueStrings.test(v2) || falseStrings.test(v1) && falseStrings.test(v2);
        }
        else if ((v1 instanceof Date || typeof v1 === 'string' && Array.isArray((_a = (tmp1 = parseDate(v1))) === null || _a === void 0 ? void 0 : _a.f)) && (v2 instanceof Date || typeof v2 === 'string' && Array.isArray((_b = (tmp2 = parseDate(v2))) === null || _b === void 0 ? void 0 : _b.f))) {
            if (tmp1)
                tmp1 = dateRelToDate(tmp1);
            else
                tmp1 = v1;
            if (tmp2)
                tmp2 = dateRelToDate(tmp2);
            else
                tmp2 = v2;
            return +tmp1 === +tmp2;
        }
        else
            return v1 == v2;
    };
    const fullnum = /^\d+$/;
    function checkIdentity(map, path) {
        const p = path.split('.').reduce((a, c) => fullnum.test(c) ? `${a}[]` : `${a}${a.length ? '.' : ''}${c}`, '');
        return map[`${p}[]`];
    }
    function diff(v1, v2, opts) {
        const type = (opts === null || opts === void 0 ? void 0 : opts.equal) && typeof opts.equal === 'object' ? opts.equal.type : opts === null || opts === void 0 ? void 0 : opts.equal;
        const eq = typeof type === 'function' ? type : type === 'strict' ? strictEqual : type === 'sql' ? sqlEqual : looseEqual;
        return _diff(v1, v2, '', {}, eq, typeof (opts === null || opts === void 0 ? void 0 : opts.equal) === 'object' ? opts === null || opts === void 0 ? void 0 : opts.equal.identity : undefined, (opts === null || opts === void 0 ? void 0 : opts.keys) || 'all');
    }
    function _diff(v1, v2, path, diff, equal, ident, keyMode) {
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
            const ks = [];
            if (keyMode === 'common') {
                for (const k of Object.keys(_v1))
                    if (k in _v2)
                        ks.push(k);
            }
            else {
                ks.push.apply(ks, Object.keys(_v1));
                for (const k of Object.keys(_v2))
                    if (!~ks.indexOf(k))
                        ks.push(k);
            }
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
        const eq = typeof equal === 'function' ? equal : equal === 'strict' ? strictEqual : equal === 'sql' ? sqlEqual : looseEqual;
        return _deepEqual(v1, v2, eq);
    }
    function _deepEqual(v1, v2, equal) {
        if (typeof v1 !== 'object' || typeof v2 !== 'object')
            return equal(v1, v2);
        if ((!v1 || !v2) && v1 != v2)
            return false; // eslint-ignore-line eqeqeq
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
    function isSchema(what) {
        return what && typeof what === 'object' && 'type' in what && typeof what.type === 'string';
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
            return [{ error: `type mismatch for${required ? ' required' : ''} ${type}`, actual: stringifySchema(inspect(value)), value, path, expected: stringifySchema(_schema, true), literal: type === 'literal' }];
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
                        tmp.filter(e => miss && e.type === 'missing' || e.type === 'check');
                    }
                    else if (tmp.find(e => e.path !== p)) {
                        if (!legit)
                            legit = tmp;
                        else if (tmp.length < legit.length)
                            legit = tmp;
                        else if (legit.filter(e => e.literal).length > tmp.filter(e => e.literal).length)
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
                            errs.push({ error: `required field '${f.name}' is missing`, path: join(p, f.name), expected: f.type });
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
                            errs.push({ error: `unknown field '${k}'`, path: p, type: 'strict', value: v[k] });
                }
            }
        }
        if (!errs.length && checks && checks.length) {
            let tmp;
            for (let i = 0; i < checks.length; i++) {
                const c = checks[i];
                tmp = evalApply(ctx, c, [value]);
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
        const csv = map(seq(skip(' \r\n\t'), repsep(record, str(opts.record), 'allow'), skip(' \r\n\t')), ([, csv]) => csv);
        const _parse = parser$1(csv, { consumeAll: true });
        return function parse(input, options) {
            const res = _parse(input, options);
            if (Array.isArray(res) && res.length > 0) {
                let header = undefined;
                if (Array.isArray(opts.header))
                    header = opts.header.map((k, i) => [k, i]);
                else if (typeof opts.header === 'object')
                    header = res.shift().map((k, i) => { var _a; return [(_a = opts.header[k]) !== null && _a !== void 0 ? _a : k, i]; }).filter(o => o[0]);
                else if (!!opts.header)
                    header = res.shift().map((k, i) => [k, i]);
                if (header) {
                    header.sort((a, b) => `${a}`.toLowerCase() < `${b}`.toLowerCase() ? -1 : `${a}`.toLowerCase() > `${b}`.toLowerCase() ? 1 : 0);
                    return res.map(v => header.reduce((a, c) => (a[c[0]] = v[c[1]], a), {}));
                }
            }
            return res;
        };
    }
    // TODO: handle ascii curses tables?
    function table(options) {
        Object.assign({ header: true }, options);
        return function parse(input, options) {
            const parts = input.split(/\r?\n/).filter(v => v);
            if (parts[1][0] === '|') {
                for (let i = 0; i < parts.length; i++) {
                    const p = parts[i];
                    parts[i] = p.replace(/^\|\s*|\s*\|$/g, '');
                }
            }
            return parts.map(p => p.trim().split(/\s*\|\s*/));
        };
    }
    const fields = [',', '|', '\t', ':', ';', '~'];
    const records = ['\r\n', '\r', '\n'];
    const quotes = ['\'', '"', '`', '$'];
    function detect(data, amount) {
        var _a;
        if (amount === undefined) {
            amount = data.indexOf('\n', data.indexOf('\n', data.indexOf('\n', 1) + 1) + 1);
            amount = amount !== null && amount !== void 0 ? amount : 2048;
            if (amount < 2048)
                amount = 2048;
        }
        const sample = data.slice(0, amount);
        // look for tables
        if ((_a = sample.split(/\r?\n/).filter(v => v)[1]) === null || _a === void 0 ? void 0 : _a.match(/^[-|+\s_=]+$/)) {
            return { table: 1, header: true };
        }
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
    function isTableOpts(opts) {
        return opts && 'table' in opts && opts.table === 1;
    }
    function parse$1(data, options) {
        var _a, _b;
        let values;
        if (isTableOpts(options)) {
            values = table(options)(data);
            values.splice(1, 1);
        }
        else {
            const base = csv(Object.assign({}, options, { header: false }))(data);
            if ('message' in base)
                return [];
            values = base;
        }
        if ((_a = options.fixedSize) !== null && _a !== void 0 ? _a : true) {
            const min = (_b = values[0]) === null || _b === void 0 ? void 0 : _b.length;
            values = values.filter(v => v.length >= min);
        }
        if (options.header && values.length) {
            let header = undefined;
            if (Array.isArray(options.header)) {
                header = options.header.map((k, i) => [k, i]);
                if (isTableOpts(options))
                    values.shift();
            }
            else if (typeof options.header === 'object') {
                header = values.shift().map((k, i) => { var _a; return [(_a = options.header[k]) !== null && _a !== void 0 ? _a : k, i]; }).filter(o => o[0]);
            }
            else if (!!options.header)
                header = values.shift().map((k, i) => [k, i]);
            if (header) {
                header.sort((a, b) => `${a}`.toLowerCase() < `${b}`.toLowerCase() ? -1 : `${a}`.toLowerCase() > `${b}`.toLowerCase() ? 1 : 0);
                return values.map(v => header.reduce((a, c) => (a[c[0]] = v[c[1]], a), {}));
            }
        }
        return values;
    }

    const ws = read(' \r\n\t');
    const endTxt = '&<';
    const entities = { amp: '&', gt: '>', lt: '<' };
    const entity = map(seq(str('&'), str('amp', 'gt', 'lt'), str(';')), ([, which]) => entities[which] || '', 'entity');
    const name = read1('abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-_:$', 'name');
    const attr = map(seq(name, opt(seq(ws, str('='), ws, alt(name, quoted('"'), quoted("'"))))), ([name, rest]) => ({ name, value: rest ? rest[3] : true }), 'attr');
    function quoted(quote) {
        return map(seq(str(quote), readTo(quote), str(quote)), ([, str]) => str);
    }
    const open = map(seq(str('<'), ws, name, ws, repsep(attr, ws, 'allow'), opt(str('/')), str('>')), ([, , name, , attrs, close]) => ({ open: true, name, attrs, empty: !!close }), 'open');
    const close = map(seq(str('</'), ws, name, ws, str('>')), ([, , name]) => ({ close: true, name }), 'close');
    const content = map(rep1(alt(read1To(endTxt, true), entity), 'content'), txts => txts.join('').trim());
    const stream = rep(alt(open, content, close));
    const _parse = parser$1(stream, { trim: true, consumeAll: true, undefinedOnError: true });
    function put(target, prop, value) {
        if (prop in target) {
            if (Array.isArray(target[prop]))
                target[prop].push(value);
            else
                target[prop] = [target[prop], value];
        }
        else {
            target[prop] = value;
        }
    }
    function parse(str, strict) {
        const stack = [];
        const names = [];
        const res = [];
        let content = '';
        const stream = _parse(str);
        if (!stream || 'error' in stream)
            return undefined;
        function close(end) {
            const val = stack.pop();
            if (!val)
                return;
            const name = names.pop();
            if (!stack.length) {
                res.push(val);
            }
            else {
                if (!Object.keys(val).length)
                    put(stack[stack.length - 1], name, content || '');
                else
                    put(stack[stack.length - 1], name, val);
            }
            if (end !== name)
                close(end);
        }
        for (const p of stream) {
            if (typeof p === 'string') {
                if (p)
                    content += p;
            }
            else if ('open' in p) {
                content = '';
                const val = p.attrs.reduce((a, c) => (put(a, c.name, c.value), a), {});
                if (p.empty) {
                    if (stack.length)
                        put(stack[stack.length - 1], p.name, val);
                    else
                        res.push(val);
                }
                else {
                    names.push(p.name);
                    stack.push(val);
                }
            }
            else if ('close' in p) {
                if (strict && p.name !== names[names.length - 1])
                    return;
                close(p.name);
            }
        }
        if (names.length && !strict)
            close(names[0]);
        return res.length > 1 ? res : res.length === 1 ? res[0] : undefined;
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
    const generateDefaults = {
        max: 10000,
    };
    function stringTimes(str, times) {
        let res = '';
        for (let i = 0; i < times; i++)
            res += str;
        return res;
    }
    const roundDefaults = {
        places: 2,
        'all-numeric': false,
        method: 'half-even',
    };
    function round(amt, settings) {
        var _a, _b;
        const place = (_a = settings === null || settings === void 0 ? void 0 : settings.places) !== null && _a !== void 0 ? _a : roundDefaults.places;
        const type = (_b = settings === null || settings === void 0 ? void 0 : settings.method) !== null && _b !== void 0 ? _b : roundDefaults.method;
        if (place > 0) {
            let str = (+amt || 0).toString();
            const point = str.indexOf('.');
            if (!~point)
                return (+str).toFixed(place);
            let dec = str.slice(point + 1);
            if (dec.length <= place)
                return (+str).toFixed(place);
            str += '0';
            dec += '0';
            const l = +`${str.slice(place - dec.length, place - dec.length + 1)}` || 0;
            const rest = parseInt(str.slice(place - dec.length) + '0');
            if (type === 'up' && rest > 0) {
                if (+amt > 0)
                    return (+str.slice(0, place - dec.length) + +`0.${stringTimes('0', place - 1)}1`).toFixed(place);
                else
                    return str.slice(0, place - dec.length);
            }
            else if (type === 'down' && rest > 0) {
                if (+amt < 0)
                    return (+str.slice(0, place - dec.length) - +`0.${stringTimes('0', place - 1)}1`).toFixed(place);
                else
                    return str.slice(0, place - dec.length);
            }
            else if (type === 'to-0' && rest > 0) {
                return str.slice(0, place - dec.length);
            }
            else if (type === 'from-0' && rest > 0) {
                if (+amt < 0)
                    return (+str.slice(0, place - dec.length) - +`0.${stringTimes('0', place - 1)}1`).toFixed(place);
                else
                    return (+str.slice(0, place - dec.length) + +`0.${stringTimes('0', place - 1)}1`).toFixed(place);
            }
            if (+l < 5)
                return str.slice(0, place - dec.length);
            else if (+l > 5 || +`${str.slice(1 + place - dec.length)}`)
                return (+amt).toFixed(place);
            else {
                const pre = `${str.slice(0, place - dec.length)}`;
                const f = +str.slice(place - dec.length - 1, place - dec.length);
                if (type === 'half-odd')
                    return (+`${pre}${f % 2 === 0 ? 6 : 4}`).toFixed(place);
                else if (type === 'half-up')
                    return (+`${pre}${+pre > 0 ? 6 : 4}`).toFixed(place);
                else if (type === 'half-down')
                    return (+`${pre}${+pre > 0 ? 4 : 6}`).toFixed(place);
                else if (type === 'half-to-0')
                    return (+`${pre}4`).toFixed(place);
                else if (type === 'half-from-0')
                    return (+`${pre}6`).toFixed(place);
                else
                    return (+`${pre}${f % 2 === 0 ? 4 : 6}`).toFixed(place);
            }
        }
        else if (place === 0) {
            let str = (+amt || 0).toString();
            const point = str.indexOf('.');
            if (!~point)
                return str;
            str = `${str}00`;
            const p = +str.slice(point - 1, point);
            const n = +str.slice(point + 1, point + 2);
            const rest = parseInt(str.slice(point + 1) + '0');
            if (type === 'up' && rest > 0) {
                if (+amt > 0)
                    return (+str.slice(0, point) + 1).toFixed(0);
                else
                    return str.slice(0, point);
            }
            else if (type === 'down' && rest > 0) {
                if (+amt < 0)
                    return (+str.slice(0, point) - 1).toFixed(0);
                else
                    return str.slice(0, point);
            }
            else if (type === 'to-0' && rest > 0) {
                return str.slice(0, point);
            }
            else if (type === 'from-0' && rest > 0) {
                if (+amt < 0)
                    return (+str.slice(0, point) - 1).toFixed(0);
                else if (+amt > 0)
                    return (+str.slice(0, point) + 1).toFixed(0);
            }
            if (n < 5)
                return str.slice(0, point);
            else if (n > 5 || n === 5 && +str.slice(point + 2))
                return (+`${str.slice(0, point - 1)}0` + (p + 1) * (+str < 0 ? -1 : 1)).toString();
            else {
                const base = +`${str.slice(0, point - 1)}0`;
                if (type === 'half-odd')
                    return (base + (p % 2 === 0 ? p + 1 : p) * (+str < 0 ? -1 : 1)).toString();
                else if (type === 'half-up')
                    return (base + (+str > 0 ? p + 1 : p) * (+str < 0 ? -1 : 1)).toString();
                else if (type === 'half-down')
                    return (base + (+str < 0 ? p + 1 : p) * (+str < 0 ? -1 : 1)).toString();
                else if (type === 'half-to-0')
                    return base.toString();
                else if (type === 'half-from-0')
                    return (base + 1).toString();
                else
                    return (base + (p % 2 === 0 ? p : p + 1) * (+str < 0 ? -1 : 1)).toString();
            }
        }
        else {
            let str = `${+amt < 0 ? Math.floor(+amt || 0) : Math.ceil(+amt || 0)}`;
            if (0 - place > str.length && type !== 'up' && type !== 'down' && type !== 'to-0' && type !== 'from-0')
                return `0`;
            const n = +str.slice(place, place === -1 ? undefined : place + 1);
            const rest = +(str.slice(place) + '0');
            let p = str.slice(place - 1, place);
            if (p === '-')
                p = '';
            const zeroes = `${Math.pow(10, 0 - place).toString().slice(1)}`;
            if (!p) {
                const big = `${+str < 0 ? '-' : ''}1${zeroes}`;
                if (type === 'up') {
                    if (+amt > 0)
                        return big;
                    else
                        return '0';
                }
                else if (type === 'down') {
                    if (+amt < 0)
                        return big;
                    else
                        return '0';
                }
                else if (type === 'to-0') {
                    return '0';
                }
                else if (type === 'from-0') {
                    return big;
                }
                if (+str > 0 && +str < 5 || +str < 0 && +str > -5)
                    return '0';
                else if (+str > 0 && +str > 5 || +str < 0 && +str < -5)
                    return big;
                else {
                    if (type === 'half-odd')
                        return big;
                    else if (type === 'half-up')
                        return +str > 0 ? big : '0';
                    else if (type === 'half-down')
                        return +str > 0 ? '0' : big;
                    else if (type === 'half-to-0')
                        return '0';
                    else if (type === 'half-from-0')
                        return big;
                    else
                        return '0';
                }
            }
            else {
                if (type === 'up' && rest > 0) {
                    if (+str > 0)
                        return (+(str.slice(0, place) + stringTimes('0', place * -1)) + +`1${stringTimes('0', place * -1)}`).toFixed(0);
                    else
                        return str.slice(0, place) + stringTimes('0', place * -1);
                }
                else if (type === 'down' && rest > 0) {
                    if (+str < 0)
                        return (+(str.slice(0, place) + stringTimes('0', place * -1)) - +`1${stringTimes('0', place * -1)}`).toFixed(0);
                    else
                        return str.slice(0, place) + stringTimes('0', place * -1);
                }
                else if (type === 'to-0' && rest > 0) {
                    return str.slice(0, place) + stringTimes('0', place * -1);
                }
                else if (type === 'from-0' && rest > 0) {
                    if (+str > 0)
                        return (+(str.slice(0, place) + stringTimes('0', place * -1)) + +`1${stringTimes('0', place * -1)}`).toFixed(0);
                    return (+(str.slice(0, place) + stringTimes('0', place * -1)) - +`1${stringTimes('0', place * -1)}`).toFixed(0);
                }
                if (n < 5)
                    return `${str.slice(0, place)}${zeroes}`;
                else if (n > 5 || place < -1 && +`${str.slice(place + 1)}`)
                    return (+`${+str.slice(0, place - 1) || 0}${0}${zeroes}` + +`${+p + 1}${zeroes}` * (+str < 0 ? -1 : 1)).toString();
                else {
                    const base = +`${str.slice(0, place - 1) || 0}0${zeroes}`;
                    if (type === 'half-odd')
                        return (base + +`${+p % 2 === 0 ? +p + 1 : +p}${zeroes}` * (+str < 0 ? -1 : 1)).toString();
                    else if (type === 'half-up')
                        return (base + +`${+str > 0 ? +p + 1 : +p}${zeroes}` * (+str < 0 ? -1 : 1)).toString();
                    else if (type === 'half-down')
                        return (base + +`${+str < 0 ? +p + 1 : +p}${zeroes}` * (+str < 0 ? -1 : 1)).toString();
                    else if (type === 'half-to-0')
                        return (base + +`${+p}${zeroes}` * (+str < 0 ? -1 : 1)).toString();
                    else if (type === 'half-from-0')
                        return (base + +`${+p + 1}${zeroes}` * (+str < 0 ? -1 : 1)).toString();
                    else
                        return (base + +`${+p % 2 === 0 ? +p : +p + 1}${zeroes}` * (+str < 0 ? -1 : 1)).toString();
                }
            }
        }
    }
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
        if (l === r || l == r)
            return true; // eslint-disable-line eqeqeq
        if (isDateRel(l) && isDateRel(r))
            return +dateRelToDate(l) === +dateRelToDate(r);
        if (typeof l === 'number' && typeof r === 'number')
            return isNaN(l) && isNaN(r);
        return false;
    }
    /**
     * Find the first overlapping substring that contains threshhold percent characters of the smallest string length.
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
     * @param threshhold - defaults to 0.5 - the required similarity between two substrings, accounting for the fudge factor
     * @param fudges - the number skippable characters in either string without a match
     * @param whole - adjust the similarity account for the whole string rather than only the first matching substring
     * @returns - the similarity of the first qualifying match
     */
    function similarity(a, b, threshhold = 0.5, fudges = 2, whole = false) {
        const res = similar(a, b, threshhold, fudges);
        if (res && whole)
            return (res[2] || 0) * (((res[0].length / a.length) + (res[1].length / b.length)) / 2);
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
    function inRange(v, range) {
        let found = false;
        let excluded = false;
        for (const r of range) {
            if (Array.isArray(r) && v >= r[0] && v <= r[1])
                found = true;
            else if (typeof r === 'object' && 'not' in r) {
                if (Array.isArray(r.not) && v >= r.not[0] && v <= r.not[1])
                    excluded = true;
                else if (v == r.not)
                    excluded = true;
            }
            else if (v == r)
                found = true;
        }
        return found && !excluded;
    }
    // basic ops
    registerOperator(simple(['is', 'is-not', '==', '!='], (name, values) => {
        const [l, r] = values;
        let cmp = equals(l, r);
        if (!cmp && (name === 'is' || name === 'is-not') && isSchema(r))
            cmp = validate(l, r, 'loose') === true;
        return name === 'is' || name === '==' ? cmp : !cmp;
    }), simple(['strict-is', 'strict-is-not'], (name, values) => {
        const [l, r] = values;
        let res = l === r;
        if (!res && isSchema(r))
            res = validate(l, r, 'strict') === true;
        return name === 'strict-is' ? res : !res;
    }), simple(['deep-is', 'deep-is-not', '===', '!=='], (name, [l, r, equal], opts, ctx) => {
        equal = equal || (opts === null || opts === void 0 ? void 0 : opts.equal);
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
            const found = inRange(+l, range);
            return name === 'in' ? found : !found;
        }
        else if (isApplication(l)) {
            let found = false;
            if (Array.isArray(r) || r && typeof r === 'object' && '0' in r)
                found = Array.prototype.find.call(r, (e, i) => evalApply(ctx, l, [e, i], { index: i, key: i }));
            else if (r && typeof r === 'object')
                found = Object.entries(r).find((e, i) => evalApply(ctx, l, [e[1], i, e[0]], { index: i, key: e[0] }));
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
                found = Array.prototype.find.call(l, (e, i) => evalApply(ctx, r, [e, i], { index: i, key: i }));
            else if (r && typeof l === 'object')
                found = Object.entries(l).find((e, i) => evalApply(ctx, r, [e[1], i, e[0]], { index: i, key: e[0] }));
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
        else if (typeof r === 'number')
            return safeGet(c, '' + r);
        else
            return evaluate(c, r);
    }), simple(['generate'], (_name, [apply], opts, ctx) => {
        let r;
        if (apply && isApplication(apply)) {
            const res = [];
            let state = opts;
            let it;
            for (let i = 0; i < generateDefaults.max; i++) {
                it = evalApply(ctx, apply, [state, it, i], { index: i, last: it, state });
                if (Array.isArray(it))
                    it.forEach(v => res.push(v));
                else if (it && typeof it === 'object') {
                    const keys = Object.keys(it);
                    if (keys.find(k => k !== 'value' && k !== 'state'))
                        res.push(it);
                    else {
                        res.push(it.value);
                        state = it.state || state;
                        it = it.value;
                    }
                }
                else if (it === undefined)
                    break;
                else
                    res.push(it);
            }
            return res;
        }
        else if ((r = range(apply)) && Array.isArray(r)) {
            r = r.filter(v => typeof v === 'number' || Array.isArray(v) && !v.find(v => v === Infinity || v === -Infinity) || typeof v === 'object' && !Array.isArray(v));
            const nums = [];
            const no = [];
            for (const v of r)
                if (typeof v === 'object' && !Array.isArray(v))
                    no.push(typeof v.not === 'number' ? [v.not, v.not] : v.not);
            for (const v of r) {
                if (nums.length >= generateDefaults.max)
                    break;
                if (typeof v === 'number' && !no.find(([l, r]) => v >= l && v <= r))
                    nums.push(v);
                else if (Array.isArray(v)) {
                    for (let i = v[0]; i <= v[1]; i++) {
                        if (!no.find(([l, r]) => i >= l && i <= r))
                            nums.push(i);
                        if (nums.length >= generateDefaults.max)
                            break;
                    }
                }
            }
            return nums;
        }
        return [];
    }), simple(['array'], (_name, values, opts) => {
        if (values.length === 1 && (opts === null || opts === void 0 ? void 0 : opts.range)) {
            let range$1 = values[0];
            if (typeof range$1 === 'string')
                range$1 = range(range$1);
            if (Array.isArray(range$1)) {
                const bounds = Array.isArray(opts.bounds) && opts.bounds.length === 2 && opts.bounds.filter(b => typeof b === 'number').length === 2 ? opts.bounds : [-100, 200];
                bounds.slice().sort((l, r) => l < r ? -1 : l > r ? 1 : 0);
                let [lower, upper] = bounds;
                if (upper - lower > 10000)
                    lower = upper - 10000;
                const res = [];
                for (let i = lower; i <= upper; i++)
                    if (inRange(i, range$1))
                        res.push(i);
                return res;
            }
            else
                return [];
        }
        return values;
    }), simple(['object'], (_name, values) => {
        const res = {};
        if (values.length === 1 && Array.isArray(values[0]))
            values = values[0];
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
            else if (typeof arr === 'object' && arr) {
                let step = Object.entries(arr).filter((e, i) => evalApply(ctx, flt, [e[1], i, e[0]], { index: i, key: e[0] }));
                if (sorts)
                    step = sort(ctx, step, sorts, (c, b, v) => evalApply(c, b, [v[1], v[0]], { key: v[0] }));
                return step.reduce((a, c) => (a[c[0]] = c[1], a), {});
            }
            else
                return [];
        }
        return filter({ value: arr }, flt, sorts, groups, ctx).value;
    }), simple(['source'], (_name, values, _opts, ctx) => {
        const [val, app] = values;
        let source = toDataSet(val);
        if (isApplication(app))
            return evalApply(ctx, app, [], { source });
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
        let [arr, sorts] = values;
        if (!Array.isArray(arr)) {
            if (arr && Array.isArray(arr.value))
                arr = arr.value;
            else if (arr && typeof arr === 'object') {
                if (!sorts)
                    sorts = [{ a: { r: { p: '@', k: ['key'] } } }];
                return sort(ctx, Object.entries(arr), sorts, (c, b, v) => evalApply(c, b, [v[1], v[0]], { key: v[0] })).reduce((a, c) => (a[c[0]] = c[1], a), {});
            }
            else
                return {};
        }
        if (!sorts)
            sorts = [{ a: { r: { k: ['_'] } } }];
        return sort(ctx, arr.slice(), sorts);
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
                        // watch out for last day of month next to longer month
                        const end = new Date(+from);
                        const endM = end.getMonth();
                        end.setDate(end.getDate() + 1);
                        if (endM !== end.getMonth()) {
                            // make sure target date is last day of month
                            to.setMonth(to.getMonth() + 1);
                            to.setDate(0);
                        }
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
    }), simple(['string', 'unparse'], (name, args, opts) => {
        const [value] = args;
        opts = opts || args[1] || {};
        if (!opts || typeof opts !== 'object')
            opts = {};
        if (name === 'unparse')
            opts = Object.assign({}, opts, { raport: 1 });
        if (opts.raport && opts.tpl)
            opts.template = 1;
        if (!opts && (value === null || value === undefined))
            return '';
        if (typeof opts === 'object') {
            if (opts.json)
                return JSON.stringify(value);
            if (opts.schema)
                return stringifySchema(value);
            if (opts.base64)
                return btoa(value);
            else if (opts.raport) {
                let v = stringify(value, opts);
                if (v === undefined)
                    v = stringify({ v: value }, opts);
                return v;
            }
            else if (typeof value === 'string' && opts.styled)
                return style(value);
            else if (value == null)
                return '';
        }
        if (Array.isArray(value))
            return value.join(', ');
        let res = `${value}`;
        if (res.slice(0, 7) === '[object')
            return JSON.stringify(value);
        return res;
    }), simple(['log'], (_name, args, _opts, ctx) => {
        try {
            ctx.root.log(args);
        }
        catch (e) {
            console.error(e);
            console.log(...args);
        }
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
    }), simple(['diff'], (_, [left, right, equal], opts, ctx) => {
        equal = equal || (opts === null || opts === void 0 ? void 0 : opts.equal);
        if (equal && isApplication(equal)) {
            const eq = equal;
            equal = (l, r) => evalApply(ctx, eq, [l, r]);
        }
        return diff(left, right, { equal, keys: opts === null || opts === void 0 ? void 0 : opts.keys });
    }), simple(['label-diff'], (_, [diff, label], opts) => {
        return labelDiff(diff, label, opts);
    }), simple(['patch'], (_, values, opts) => {
        const dir = (opts === null || opts === void 0 ? void 0 : opts.dir) || 'forward';
        const strict = opts === null || opts === void 0 ? void 0 : opts.strict;
        const base = JSON.parse(JSON.stringify(values.shift() || {}));
        const r = new Root(base);
        if (dir === 'backward') {
            const vals = values.slice().reverse();
            if (strict) {
                for (const v of vals)
                    for (const path in v)
                        if (safeGet(r, path) == v[path][1])
                            safeSet(r, path, v[path][0]);
            }
            else {
                for (const v of vals)
                    for (const path in v)
                        safeSet(r, path, v[path][0]);
            }
        }
        else {
            if (strict) {
                for (const v of values)
                    for (const path in v)
                        if (safeGet(r, path) == v[path][0])
                            safeSet(r, path, v[path][1]);
            }
            else {
                for (const v of values)
                    for (const path in v)
                        safeSet(r, path, v[path][1]);
            }
        }
        return base;
    }));
    // math
    registerOperator(simple(['+', 'add'], (_name, values, _opts, ctx) => {
        var _a;
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
            if ((_a = ctx.special) === null || _a === void 0 ? void 0 : _a.round)
                return +values.reduce((a, c) => +round(a + +c, ctx.special.round), 0);
            else
                return values.reduce((a, c) => a + +c, 0);
        }
        else {
            return values.reduce((a, c) => a + (c === undefined || c === null ? '' : c), '');
        }
    }), simple(['cat'], (_name, values) => {
        return values.reduce((a, c) => a + (c === undefined || c === null ? '' : c), '');
    }), simple(['num'], (_name, [v]) => {
        let match;
        if (match = hasNum.exec(v))
            return +match[1];
        return parseInt(v);
    }), simple(['-', 'subtract'], (_name, values, _opts, ctx) => {
        var _a;
        const first = values.shift();
        if (!values.length)
            return -first;
        if (isDateRel(first)) {
            if (values.reduce((a, c) => a && isDateRel(c), true))
                return values.reduce((a, c) => a - +dateRelToDate(c), +dateRelToDate(first));
            if (values.reduce((a, c) => a && isTimespan(c), true))
                return values.reduce((a, c) => dateAndTimespan(a, c, -1), dateRelToDate(first));
        }
        if ((_a = ctx.special) === null || _a === void 0 ? void 0 : _a.round)
            return values.reduce((a, c) => +round(a - (!isNum(c) ? 0 : +c), ctx.special.round), !isNum(first) ? 0 : +first);
        else
            return values.reduce((a, c) => a - (!isNum(c) ? 0 : +c), !isNum(first) ? 0 : +first);
    }), simple(['*', 'multiply'], (_name, values, _opts, ctx) => {
        const first = values.shift();
        if (!isNum(first)) {
            if (values.length === 1 && isNum(values[0]) && +values[0] > 0) {
                if (typeof first === 'string') {
                    return stringTimes(first, +values[0]);
                }
                else if (Array.isArray(first) && +values[0] < 10000 && first.length < 1000) {
                    const res = [];
                    for (let i = 0; i < values[0]; i++)
                        res.push.apply(res, first);
                    return res;
                }
            }
            return 0;
        }
        if (ctx.special.round)
            return values.reduce((a, c) => +round(a * (!isNum(c) ? 0 : +c), ctx.special.round), +first);
        else
            return values.reduce((a, c) => a * (!isNum(c) ? 0 : +c), +first);
    }), simple(['/', '/%', 'divide', 'intdiv'], (name, values, _opts, ctx) => {
        var _a;
        const first = values.shift();
        if (isNaN(first))
            return 0;
        if (name.length > 1 || name === 'intdiv')
            return values.reduce((a, c) => Math.floor(a / (isNaN(c) ? 1 : +c)), +first);
        if ((_a = ctx.special) === null || _a === void 0 ? void 0 : _a.round)
            return values.reduce((a, c) => +round(a / (isNaN(c) ? 1 : +c), ctx.special.round), +first);
        else
            return values.reduce((a, c) => a / (isNaN(c) ? 1 : +c), +first);
    }), simple(['%', 'modulus'], (_name, values) => {
        const first = values.shift();
        return values.reduce((a, c) => a % (isNaN(c) ? 1 : +c), isNaN(first) ? 0 : +first);
    }), simple(['pow', '**'], (_name, values, _opts, ctx) => {
        var _a;
        const pow = values.pop();
        const first = Math.pow(values.pop(), pow);
        if ((_a = ctx.special) === null || _a === void 0 ? void 0 : _a.round)
            return values.reverse().reduce((a, c) => +round(Math.pow(c, a), ctx.special.round), first);
        else
            return values.reverse().reduce((a, c) => Math.pow(c, a), first);
    }), simple(['abs'], (_name, values) => {
        if (typeof values[0] !== 'number')
            return values[0];
        return Math.abs(values[0]);
    }), simple(['round'], (_name, [num, precision, method], opts) => {
        precision = precision !== null && precision !== void 0 ? precision : opts === null || opts === void 0 ? void 0 : opts.places;
        if (precision !== undefined || roundDefaults['all-numeric']) {
            const res = round(num, { places: precision, method: (method || (opts === null || opts === void 0 ? void 0 : opts.method)) });
            if (opts === null || opts === void 0 ? void 0 : opts.string)
                return res;
            return +res;
        }
        else
            return Math.round(num);
    }), simple(['floor'], (_name, values) => {
        return Math.floor(values[0]);
    }), simple(['ceil'], (_name, values) => {
        return Math.ceil(values[0]);
    }), simple(['rand', 'random'], (_name, args) => {
        if (!args.length || typeof args[0] === 'number') {
            const [min, max, dec] = args;
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
        }
        else if (Array.isArray(args[0])) {
            const arr = args[0];
            return arr[Math.floor(Math.random() * arr.length)];
        }
        else if (typeof args[0] === 'string' && typeof args[1] === 'number') {
            let res = '';
            const [str, count] = args;
            for (let i = 0; i < count; i++)
                res += str[Math.floor(Math.random() * str.length)];
            return res;
        }
    }));
    // string
    function pad(where, str, count, pad) {
        if (typeof str !== 'string')
            str = '' + str;
        if (!isNum(count))
            return str;
        if (typeof pad !== 'string')
            pad = '' + pad;
        if (!pad)
            pad = ' ';
        if (pad.length !== 1)
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
    registerOperator(simple(['eval'], (_name, [v], opts, ctx) => {
        if (opts === null || opts === void 0 ? void 0 : opts.template)
            return template((opts === null || opts === void 0 ? void 0 : opts.context) || ctx, v);
        else
            return evaluate((opts === null || opts === void 0 ? void 0 : opts.context) || ctx, v);
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
        if (typeof src === 'string' || Array.isArray(src))
            return src.length;
        else if (typeof src === 'object' && Object.keys(src).length === 1 && Array.isArray(src.value))
            return src.value.length;
        else if (typeof src === 'object')
            return Object.keys(src).length;
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
            return src.slice().reverse();
        }
    }), simple(['wrap-count'], (_name, [str, width, font], opts, ctx) => {
        var _a;
        let w = width || (opts === null || opts === void 0 ? void 0 : opts.width);
        const avail = safeGet(ctx, '@placement.availableX') || 48;
        if ((_a = ctx.special) === null || _a === void 0 ? void 0 : _a.widget) {
            const ww = ctx.special.widget.width;
            if (ww) {
                if (ww === 'grow')
                    w = avail;
                else if (typeof ww === 'number')
                    w = ww;
                else if (typeof ww === 'object' && typeof ww.percent === 'number')
                    w = (ww.percent / 100) * avail;
                else if (typeof ww === 'object' && typeof ww.x === 'string')
                    w = evaluate(ctx, ww.x);
            }
        }
        if (!w)
            w = avail;
        font = font || (opts === null || opts === void 0 ? void 0 : opts.font) || safeGet(ctx, '@widget.font');
        if (opts) {
            font = Object.assign({}, font);
            for (const k of ['family', 'size', 'line', 'metric', 'break-word'])
                if (k in opts)
                    font[k] = opts[k];
        }
        return measure(str, w, { context: ctx }, font);
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
        if (res instanceof Date && isNaN(+res))
            return undefined;
        return res;
    }), simple(['interval'], (_name, [v], _opts, ctx) => {
        return evaluate(ctx, ~v.indexOf('#') ? v : `#${v}#`);
    }), simple(['upper', 'lower'], (name, [v]) => {
        v = v == null ? '' : v;
        return name === 'upper' ? `${v}`.toUpperCase() : `${v}`.toLowerCase();
    }), simple(['format', 'fmt'], (_name, args, opts, ctx) => {
        let [v, fmt, ...s] = args;
        const op = formats[fmt];
        if (!op) {
            let op = getOperator(fmt);
            if (!op) {
                const o = safeGet(ctx, fmt) || safeGet(ctx.root, fmt);
                if (isApplication(o))
                    op = o;
            }
            if (op) {
                const args = [v, ...s];
                return applyOperator(ctx, { op: fmt, args: args.map(v => isApplication(v) ? v : ({ v })), opts: { v: opts || virtualFormats[fmt] } });
            }
            else
                return `${v}`;
        }
        else
            return op.apply(v, s, (opts || op.defaults));
    }), simple(['set-defaults'], (_name, [type, name], opts, ctx) => {
        if (type === 'format' && typeof name === 'string') {
            const fmt = formats[name];
            if (fmt)
                return Object.assign(fmt.defaults, opts);
            const vfmt = virtualFormats[name];
            if (vfmt)
                return Object.assign(vfmt.defaults, opts);
        }
        else if (type === 'round') {
            if (opts === null || opts === void 0 ? void 0 : opts.context) {
                if (opts === null || opts === void 0 ? void 0 : opts.unset) {
                    if (ctx.special)
                        delete ctx.special.round;
                }
                else
                    (ctx.special || (ctx.special = {})).round = Object.assign({}, opts, { context: undefined });
            }
            else
                Object.assign(roundDefaults, opts);
        }
        else if (type === 'generate') {
            Object.assign(generateDefaults, opts);
        }
    }), simple(['parse'], (_name, args, opts) => {
        opts = opts || args[1] || {};
        if (!opts || typeof opts !== 'object')
            opts = {};
        const [v] = args;
        if (opts.date)
            return parseDate(v, opts);
        else if (opts.template || opts.tpl)
            return parse$2(v, opts);
        else if (opts.time)
            return parseTime(v, opts);
        else if (opts.expr)
            return parseExpr(v, opts);
        else if (opts.json)
            return JSON.parse(v);
        else if (opts.schema)
            return parseSchema(v);
        else if (opts.range)
            return range(v, opts);
        else if (opts.xml)
            return parse(v, opts.strict);
        else if (opts.csv || opts.delimited) {
            if (opts.detect || (!opts.field && !opts.separator && !opts.record && !opts.quote))
                opts = Object.assign(detect(v, opts.context), opts);
            return parse$1(v, opts);
        }
        else if (opts.base64)
            return atob(v);
        else
            return parse$3(v, opts);
    }), simple(['detect-delimiters'], (_name, [data, max], opts) => {
        if (typeof data !== 'string')
            return {};
        return detect(data, max !== null && max !== void 0 ? max : opts === null || opts === void 0 ? void 0 : opts.context);
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
                return value.map((v, i) => evalApply(ctx, body, [v, i], { last, index: i, key: i, 'last-key': last })).join((opts === null || opts === void 0 ? void 0 : opts.join) || '');
            }
            else if (typeof value === 'object' && value) {
                const entries = Object.entries(value);
                const lastKey = entries[entries.length - 1][0];
                const last = entries.length - 1;
                return Object.entries(value).map(([k, v], i) => evalApply(ctx, body, [v, k], { last, 'last-key': lastKey, index: i, key: k })).join('');
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
            return evalApply(ctx, body, [value]);
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
            var _a;
            if ((_a = ctx.special) === null || _a === void 0 ? void 0 : _a.round)
                return +round(arr.reduce((a, c) => +round(a + num(args[0] ? evalApply(ctx, args[0], [c]) : c)), 0) / arr.length);
            else
                return arr.reduce((a, c) => a + num(args[0] ? evalApply(ctx, args[0], [c]) : c), 0) / arr.length;
        },
    }, {
        type: 'aggregate',
        names: ['sum'],
        apply(_name, arr, args, _opts, ctx) {
            var _a;
            if ((_a = ctx.special) === null || _a === void 0 ? void 0 : _a.round)
                return arr.reduce((a, c) => +round(a + num(args[0] ? evalApply(ctx, args[0], [c]) : c)), 0);
            else
                return arr.reduce((a, c) => a + num(args[0] ? evalApply(ctx, args[0], [c]) : c), 0);
        }
    }, {
        type: 'aggregate',
        names: ['count'],
        apply(_name, arr, args, opts, ctx) {
            if ((opts === null || opts === void 0 ? void 0 : opts.partition) && isApplication(opts.partition)) {
                return arr.reduce((a, e, i) => {
                    const key = evalApply(ctx, opts.partition, [e, i]);
                    if (key in a)
                        a[key]++;
                    else
                        a[key] = 1;
                    return a;
                }, {});
            }
            else if ((opts === null || opts === void 0 ? void 0 : opts.sub) && typeof opts.sub === 'object' && !Object.values(opts.sub).find(o => !isApplication(o))) {
                return arr.reduce((a, e, i) => {
                    for (const k in opts.sub) {
                        let res = evalApply(ctx, opts.sub[k], [e, i]);
                        if (!res)
                            continue;
                        if (typeof res === 'string')
                            res = [res];
                        else if (!Array.isArray(res))
                            res = [k];
                        for (const k of res) {
                            if (k in a)
                                a[k]++;
                            else
                                a[k] = 1;
                        }
                    }
                    return a;
                }, {});
            }
            else if (args.length)
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
            if ((Array.isArray(v) || v && '0' in v) && isApplication(app)) {
                const res = Array.prototype.map.call(v, (e, i) => evalApply(ctx, app, [e, i], { index: i, key: i }));
                if (opts && opts.flat)
                    return flatten(res, opts.flat);
                return res;
            }
            else if (v && typeof v === 'object' && isApplication(app)) {
                if (opts && opts.array) {
                    const res = Object.entries(v).map((p, i) => evalApply(ctx, app, [p[1], i, p[0]], { index: i, key: p[0] }));
                    if (opts && opts.flat)
                        return flatten(res, opts.flat);
                    return res;
                }
                if (opts && opts.entries)
                    return Object.entries(v).reduce((a, p, i) => {
                        const r = evalApply(ctx, app, [p[1], i, p[0]], { index: i, key: p[0] });
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
                    const r = evalApply(ctx, app, [e[1], i, e[0]], { index: i, key: e[0] });
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
        names: ['index'],
        apply(_name, arr, args, opts, ctx) {
            if (!args[0])
                return {};
            const many = opts && opts.many;
            return arr.reduce((a, c, i) => _indexPair(a, evalApply(ctx, args[0], [c, i], { index: i, all: a }), c, many), {});
        },
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
            if (isApplication(args[0])) {
                arr = arr.map(e => evalApply(ctx, args[0], [e]));
                args = args.slice(1);
            }
            if (args.length > 1 && arr.length > 2)
                return [arr.slice(0, -1).join(evalParse(ctx, args[0])), arr[arr.length - 1]].join(evalParse(ctx, args[1]));
            else if (args.length > 2 && arr.length === 2)
                return arr.join(evalParse(ctx, args[2]));
            return arr.join(evalParse(ctx, args[0]));
        }
    }, {
        type: 'aggregate',
        names: ['find'],
        apply(_name, arr, args, _opts, ctx) {
            if (!args[0])
                return;
            else if (isApplication(args[0]))
                return arr.find((e, i) => evalApply(ctx, args[0], [e, i], { index: i, key: i }));
            else if (isApplication(args[1])) {
                const v = evalParse(ctx, args[0]);
                if (Array.isArray(v))
                    return v.find((e, i) => evalApply(ctx, args[1], [e, i], { index: i, key: i }));
                else if (typeof v === 'object' && v) {
                    const e = Object.entries(v).find((e, i) => evalApply(ctx, args[1], [e[1], i, e[0]], { index: i, key: e[0] }));
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
        names: ['flatten'],
        apply(_name, arr, args, opts, ctx) {
            return flatten(arr, (args.length > 0 ? evalParse(ctx, args[0]) : 0) || (opts === null || opts === void 0 ? void 0 : opts.flat));
        }
    }, {
        type: 'aggregate',
        names: ['block'],
        apply(_name, _arr, args, opts, ctx) {
            const last = args.length - 1;
            if (last < 0)
                return;
            const c = (opts === null || opts === void 0 ? void 0 : opts.implicit) ? ctx : extend$1(ctx, { locals: {}, fork: !ctx.locals });
            for (let i = 0; i < last; i++)
                evalParse(c, args[i]);
            const res = evalParse(c, args[last]);
            if (opts && opts.implicit)
                ctx.locals = c.locals;
            return res;
        },
        value: true,
    });
    function flatten(n, levels = 1) {
        let res = n || [];
        const count = typeof levels !== 'number' ? 1 : levels;
        for (let i = 0; i < count; i++) {
            if (res.find(v => Array.isArray(v)))
                res = [].concat(...res);
            else
                return res;
        }
        return res;
    }
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
    function _indexPair(res, value, current, many) {
        if (Array.isArray(value)) {
            if (value.length === 0)
                return res;
            else if (value.length === 2) {
                const [k, v] = value;
                if (Array.isArray(k)) {
                    for (const kk of k) {
                        if (many) {
                            if (kk in res)
                                res[kk].push(v);
                            else
                                res[kk] = [v];
                        }
                        else
                            res[kk] = v;
                    }
                }
                else {
                    if (many) {
                        if (k in res)
                            res[k].push(v);
                        else
                            res[k] = [v];
                    }
                    else
                        res[k] = v;
                }
            }
        }
        else if (typeof value === 'object') {
            const v = value;
            if ('many' in v && Array.isArray(v.many))
                for (const i of v.many)
                    _indexPair(res, i, current, many);
            else if ('key' in v || 'keys' in v)
                _indexPair(res, [v.key || v.keys, v.value || current], current, many);
        }
        else {
            if (many) {
                if (value in res)
                    res[value].push(current);
                else
                    res[value] = [current];
            }
            else
                res[value] = current;
        }
        return res;
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
    registerFormat('styled', n => {
        return style(n);
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
    registerFormat('hex', val => {
        if (typeof val === 'number')
            return val.toString(16);
        else {
            const str = `${val}`;
            const te = new TextEncoder();
            return Array.from(te.encode(str)).map(c => c.toString(16).padStart(2, '0')).join('');
        }
    });
    registerFormat('base', (val, [n]) => {
        try {
            return val.toString(n);
        }
        catch (_a) {
            return val;
        }
    });
    registerFormat('noxml', val => escapeHTML(`${val}`));
    registerFormat('xml', (val, [n]) => {
        if (val && typeof val === 'object')
            return objectToXML(val, n);
        else
            return val;
    });
    function objectToXML(object, indent = undefined) {
        if (Array.isArray(object))
            return _objectToXML({ values: { value: object } }, 0, indent);
        const keys = Object.keys(object);
        if (keys.length > 1)
            return _objectToXML({ root: object }, 0, indent);
        if (keys.length < 1)
            return '<root />';
        if (Array.isArray(object[keys[0]]))
            return _objectToXML({ root: object }, 0, indent);
        return _objectToXML(object, 0, indent);
    }
    function _objectToXML(val, depth, indent, propname = undefined) {
        if (Array.isArray(val)) {
            return val.reduce((xml, entry) => {
                const val = _objectToXML(entry, depth + 1, indent, propname);
                const tag = val === '' || val === undefined ? `<${propname} />` : `<${propname}>${val}${indent && /\n/.test(val) ? '\n' + pad('l', '', depth * indent, ' ') : ''}</${propname}>`;
                return `${xml}${indent && depth ? '\n' + pad('l', '', depth * indent, ' ') : ''}${tag}`;
            }, '');
        }
        if (val && typeof val === 'object') {
            return Object.entries(val).reduce((xml, [name, value]) => {
                const val = _objectToXML(value, depth + (Array.isArray(value) ? 0 : 1), indent, name);
                const tag = val === '' ? `${indent && depth ? '\n' + pad('l', '', depth * indent, ' ') : ''}<${name} />` : Array.isArray(value) ? val : `${indent && depth ? '\n' + pad('l', '', depth * indent, ' ') : ''}<${name}>${val}${indent && /\n/.test(val) ? '\n' + pad('l', '', depth * indent, ' ') : ''}</${name}>`;
                return `${xml}${tag}`;
            }, '');
        }
        return escapeHTML(val);
    }
    registerFormat('base64', val => {
        return btoa(`${val}`);
    });

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
    exports.parse = parse$3;
    exports.parseCSV = csv;
    exports.parseDate = parseDate;
    exports.parsePath = parsePath;
    exports.parseRange = range;
    exports.parseSchema = parseSchema;
    exports.parseTemplate = parse$2;
    exports.parseTime = parseTime;
    exports.parseXML = parse;
    exports.registerFormat = registerFormat;
    exports.registerLayout = registerLayout;
    exports.registerOperator = registerOperator;
    exports.registerRenderer = registerRenderer;
    exports.run = run;
    exports.safeGet = safeGet;
    exports.similar = similar;
    exports.similarity = similarity;
    exports.stringify = stringify;
    exports.styled = style;
    exports.template = template;
    exports.toDataSet = toDataSet;
    exports.unparseSchema = stringifySchema;
    exports.unregisterFormat = unregisterFormat;
    exports.unregisterOperator = unregisterOperator;
    exports.validate = validate;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=raport.umd.js.map
