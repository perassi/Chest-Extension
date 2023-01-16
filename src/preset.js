
function parseNum(value, decimalSep = '.') {
    if (value == null)
        return NaN;
    // Return the value as-is if it's already a number:
    if (typeof value === 'number')
        return value;
    // build regex to strip out everything except digits, decimal point and minus sign:
    var regex = new RegExp('[^0-9-' + decimalSep + ']', 'g');
    var unformatted = value.toString(); // explicitly convert to string
    unformatted = unformatted
        // .replace(/\((.*)\)/, '-$1') // replace bracketed values with negatives
        .replace(regex, '') // strip out any cruft
        .replace(decimalSep, '.'); // make sure decimal point is standard
    unformatted = parseFloat(unformatted);
    return unformatted;
}
function fromArray(value) {
    if (Array.isArray(value))
        return value[0];
    return value;
}
function parseImageUrl(value) {
    if (typeof value === 'string') {
        if (value.startsWith('//')) {
            return 'https:' + value;
        }
    }
    return value;
}
function propertyIfIsObject(object, property, _default = undefined) {
    if (typeof object === 'object')
        return object[property] || _default;
    return object || _default;
}
function fixNewLinesInJsonStrings(json) {
    let newJson = "";
    let inString = false;
    let len = json.length;
    let i;
    let ignoreNextChar = false;
    for (i = 0; i < len; i++) {
        var currentChar = json.charAt(i);
        if (inString) {
            if (!ignoreNextChar) {
                switch (currentChar) {
                    case "\n":
                        currentChar = "\\n";
                        break;
                    case "\r":
                        currentChar = "\\r";
                        break;
                    case "\"":
                        inString = false;
                        break;
                    case "\\":
                        ignoreNextChar = true;
                        break;
                }
            }
            else {
                ignoreNextChar = false;
            }
        }
        else {
            if (currentChar == "\"") {
                inString = true;
            }
        }
        newJson += currentChar;
    }
    return newJson;
}

function getURL(data, window) {
    var _a;
    return fromArray(data.url) || ((_a = fromArray(data.offers)) === null || _a === void 0 ? void 0 : _a.url) || data['@id'];
}
function getPrice(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return parseNum(data.price
        || ((_a = data.offers) === null || _a === void 0 ? void 0 : _a.price)
        || ((_c = (_b = data.offers) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.price)
        || ((_d = data.offers) === null || _d === void 0 ? void 0 : _d.highPrice)
        || ((_f = (_e = data.offers) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.highPrice)
        || ((_h = (_g = data.offers) === null || _g === void 0 ? void 0 : _g.priceSpecification) === null || _h === void 0 ? void 0 : _h.price)
        || ((_l = (_k = (_j = data.offers) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.priceSpecification) === null || _l === void 0 ? void 0 : _l.price));
}
function getPriceCurrency(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return data.priceCurrency
        || ((_a = data.offers) === null || _a === void 0 ? void 0 : _a.priceCurrency)
        || ((_c = (_b = data.offers) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.priceCurrency)
        || ((_e = (_d = data.offers) === null || _d === void 0 ? void 0 : _d.priceSpecification) === null || _e === void 0 ? void 0 : _e.priceCurrency)
        || ((_h = (_g = (_f = data.offers) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.priceSpecification) === null || _h === void 0 ? void 0 : _h.priceCurrency);
}

function jsonld(window) {
    var _a, _b, _c, _d, _e;
    const data = [];
    // @ts-ignore
    for (const script of window.document.querySelectorAll('[type="application/ld+json"]')) {
        let jsonld;
        try {
            jsonld = JSON.parse(fixNewLinesInJsonStrings(script.innerHTML));
        }
        catch (error) {
            // reportError('Failed to parse JSON-LD', { error, script: 'script.innerHTML' })
            continue;
        }
        if (jsonld['@graph'])
            jsonld = jsonld['@graph'];
        if (Array.isArray(jsonld))
            jsonld = jsonld.find(content => content['@type'].includes('Product'));
        if (jsonld && ((_a = jsonld['@type']) === null || _a === void 0 ? void 0 : _a.includes('Product'))) {
            try {
                // check if jsonld has the required fields
                // if (!jsonld['title'] || !jsonld['image']) {
                //     continue
                // }
                data.push(jsonld);
            }
            catch (error) {
                //   reportError('Failed to populate data', { error, jsonld })
            }
        }
    }
    if (data.length) {
        let jsonld = Object.values(data.reduce((r, v, i, a, k = v['@id']) => ((r[k] || (r[k] = [])).push(v), r), {}))[0].reduce((a, b) => Object.assign(a, b), {});
        return {
            __data: jsonld,
            title: jsonld.name,
            description: jsonld.description || undefined,
            brand: propertyIfIsObject(fromArray(jsonld.brand), 'name'),
            url: getURL(jsonld),
            image: parseImageUrl(((_b = fromArray(jsonld.image)) === null || _b === void 0 ? void 0 : _b.url) || ((_c = fromArray(jsonld.image)) === null || _c === void 0 ? void 0 : _c.contentUrl) || ((_d = fromArray(jsonld.image)) === null || _d === void 0 ? void 0 : _d.contentURL) || ((_e = fromArray(jsonld.image)) === null || _e === void 0 ? void 0 : _e['@id']) || fromArray(jsonld.image)),
            price: getPrice(jsonld),
            priceCurrency: getPriceCurrency(jsonld),
        };
    }
    // return data
}

function meta(window) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let title, description, url, image, favicon;
    title = ((_a = window.document.querySelector([
        'meta[property="og:title"]',
        'meta[name="twitter:title"]',
        'meta[property="twitter:title"]',
    ].join(','))) === null || _a === void 0 ? void 0 : _a.getAttribute('content')) || ((_b = window.document.querySelector('title')) === null || _b === void 0 ? void 0 : _b.textContent);
    description = (_c = window.document.querySelector([
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
        'meta[property="twitter:description"]',
        'meta[name="description"]',
        'meta[itemprop="description"]',
    ].join(','))) === null || _c === void 0 ? void 0 : _c.getAttribute('content');
    url = ((_d = window.document.querySelector([
        'meta[property="og:url"]',
        'meta[name="twitter:url"]',
        'meta[property="twitter:url"]',
    ].join(','))) === null || _d === void 0 ? void 0 : _d.getAttribute('content')) || ((_e = window.document.querySelector([
        'link[rel="canonical"]',
        'link[rel="alternate"][hreflang="x-default"]',
    ].join(','))) === null || _e === void 0 ? void 0 : _e.getAttribute('href'));
    image = (_f = window.document.querySelector([
        'meta[property="og:image:secure_url"]',
        'meta[property="og:image:url"]',
        'meta[property="og:image"]',
        'meta[name="twitter:image:src"]',
        'meta[property="twitter:image:src"]',
        'meta[name="twitter:image"]',
        'meta[property="twitter:image"]',
        'meta[itemprop="image"]',
    ].join(','))) === null || _f === void 0 ? void 0 : _f.getAttribute('content');
    favicon = ((_g = window.document.querySelector([
        'link[rel*="icon" i]',
    ].join(','))) === null || _g === void 0 ? void 0 : _g.getAttribute('href')) || ((_h = window.document.querySelector([
        'meta[name*="msapplication" i]',
    ].join(','))) === null || _h === void 0 ? void 0 : _h.getAttribute('content'));
    return {
        title, description, url, image, favicon
    };
}

function microdata(window) {
    var _a, _b;
    function prepend(target, addition) {
        [].unshift.apply(target, [].slice.call(addition));
    }
    const attributeNameByTagName = {
        meta: 'content',
        audio: 'src',
        embed: 'src',
        iframe: 'src',
        img: 'src',
        source: 'src',
        video: 'src',
        a: 'href',
        area: 'href',
        link: 'href',
        object: 'data',
        time: 'datetime',
    };
    function extract(scope) {
        const itemType = scope.getAttribute('itemtype');
        if (itemType === null) {
            throw new Error(`Missing itemtype on element ${scope.outerHTML}`);
        }
        const microdata = { '@type': new URL(itemType).pathname.slice(1) };
        const children = [...scope.children];
        let child = undefined;
        while ((child = children.shift())) {
            const key = child.getAttribute('itemprop');
            if (key) {
                add(microdata, key, value(child));
            }
            if (child.getAttribute('itemscope') === null)
                prepend(children, child.children);
        }
        return microdata;
    }
    function add(microdata, key, value) {
        if (value === null)
            return;
        const prop = microdata[key];
        if (prop == null)
            microdata[key] = value;
        else if (Array.isArray(prop))
            prop.push(value);
        else
            microdata[key] = [prop, value];
    }
    function value(element) {
        var _a;
        if (element.getAttribute('itemscope') !== null) {
            return extract(element);
        }
        const attributeName = Object.values(attributeNameByTagName).find(_attributeName => element.hasAttribute(_attributeName));
        const rawStringValue = (attributeName ? element.getAttribute(attributeName) : element.textContent);
        const stringValue = rawStringValue
            .trim()
            .split(/\n/)
            .map((s) => s.trim())
            .join(' ');
        let itemType = element.getAttribute('itemtype');
        try {
            itemType = (_a = new URL(itemType)) === null || _a === void 0 ? void 0 : _a.pathname.substring(1);
        }
        catch (_b) { }
        switch (itemType) {
            default:
                return stringValue;
            case 'Text':
            case 'DateTime':
            case 'Date':
            case 'Time':
            case 'CssSelectorType':
            case 'PronounceableText':
            case 'URL':
            case 'XPathType':
                return stringValue;
            case 'Number':
            case 'Float':
            case 'Integer':
                return Number(stringValue);
            case 'Boolean':
            case 'False':
            case 'True':
                return Boolean(stringValue);
            // default:
            // throw new Error(`Unable to extract value. Change itemtype to a primitive type or add itemscope on element ${element.outerHTML}`);
        }
    }
    const itemScope = window.document.querySelector(`[itemscope][itemtype*="schema.org/Product"]`);
    try {
        const data = itemScope === null ? null : extract(itemScope);
        if (data) {
            return {
                __data: data,
                title: fromArray(data.name),
                description: fromArray(data.description),
                brand: propertyIfIsObject(fromArray(data.brand), 'name'),
                url: getURL(data, window),
                image: parseImageUrl(((_a = fromArray(data.image)) === null || _a === void 0 ? void 0 : _a.url) || ((_b = fromArray(data.image)) === null || _b === void 0 ? void 0 : _b.contentUrl) || fromArray(data.image)),
                price: getPrice(data),
                priceCurrency: getPriceCurrency(data),
            };
        }
    }
    catch (error) {
        return `Error ${error}`;
        // reportError('Failed to populate microdata', { error })
    }
}

function run(window) {
    var _a, _b;
    const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
    // try {
    const product = jsonld(window) || microdata(window);
    const meta$1 = meta(window);
    if (product) {
        if (!product.url || ((_a = product.image) === null || _a === void 0 ? void 0 : _a.startsWith('data:'))) {
            product.url = meta$1.url || window.document.URL;
        }
        if (!product.image || ((_b = product.image) === null || _b === void 0 ? void 0 : _b.startsWith('data:'))) {
            product.image = meta$1.image;
        }
    }
    // make sure url & image absolute urls
    ['url', 'image', 'favicon'].forEach(key => {
        if ((product === null || product === void 0 ? void 0 : product[key]) && !ABSOLUTE_URL_REGEX.test(product[key])) {
            product[key] = new URL(product[key], window.location.origin).toString();
        }
        if ((meta$1 === null || meta$1 === void 0 ? void 0 : meta$1[key]) && !ABSOLUTE_URL_REGEX.test(meta$1[key])) {
            meta$1[key] = new URL(meta$1[key], window.location.origin).toString();
        }
    });
    return { product, meta: meta$1 };
    // } catch (error) {
    //     console.error(error)
    // }
}

window.__CHESTR__ = run(window);