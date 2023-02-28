
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
function elementAttribute(window, attribute, selector) {
    var _a;
    return (_a = window.document.querySelector(selector)) === null || _a === void 0 ? void 0 : _a[attribute];
}
function elementValue(window, selector) {
    return elementAttribute(window, 'value', selector);
}
function elementTextContent(window, selector) {
    var _a;
    return (_a = elementAttribute(window, 'textContent', selector)) === null || _a === void 0 ? void 0 : _a.trim();
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

var currencies$1 = [
    { code: 'aed', symbols: ['د.إ', 'dirham'], name: 'United Arab Emirates dirham', exponent: 2 },
    { code: 'afn', symbols: ['؋'], name: 'Afghanistan Afghani', exponent: 2 },
    { code: 'all', symbols: ['lek'], name: 'Albania Lek', exponent: 2 },
    { code: 'amd', symbols: [], name: 'Armenian Dram', exponent: 2 },
    { code: 'ang', symbols: ['ƒ'], name: 'Netherlands Antilles Guilder', exponent: 2 },
    { code: 'aoa', symbols: [], name: 'Angola Kwanza', exponent: 2 },
    { code: 'ars', symbols: ['ar$'], name: 'Argentina Peso', exponent: 2 },
    { code: 'aud', symbols: ['au$'], name: 'Australia Dollar', exponent: 2 },
    { code: 'awg', symbols: ['ƒ'], name: 'Aruba Guilder', exponent: 2 },
    { code: 'azn', symbols: ['ман'], name: 'Azerbaijan New Manat', exponent: 2 },
    { code: 'bam', symbols: ['km'], name: 'Bosnia and Herzegovina Convertible Marka', exponent: 2 },
    { code: 'bbd', symbols: ['bb$'], name: 'Barbados Dollar', exponent: 2 },
    { code: 'bdt', symbols: [], name: 'Bangladesh Taka', exponent: 2 },
    { code: 'bgn', symbols: ['лв', 'lv'], name: 'Bulgaria Lev', exponent: 2 },
    { code: 'bhd', symbols: [], name: 'Bahraini Dinar', exponent: 2 },
    { code: 'bif', symbols: [], name: 'Burundi Franc', exponent: 2 },
    { code: 'bmd', symbols: [], name: 'Bermuda Dollar', exponent: 2 },
    { code: 'bnd', symbols: [], name: 'Brunei Darussalam Dollar', exponent: 2 },
    { code: 'bob', symbols: ['$b'], name: 'Bolivia Bolíviano', exponent: 2 },
    { code: 'brl', symbols: ['r$'], name: 'Brazil Real', exponent: 2 },
    { code: 'bsd', symbols: ['bs$'], name: 'Bahamas Dollar', exponent: 2 },
    { code: 'bwp', symbols: ['p'], name: 'Botswana Pula', exponent: 2 },
    { code: 'byn', symbols: ['br'], name: 'Belarus Ruble', exponent: 2 },
    { code: 'bzd', symbols: ['bz$'], name: 'Belize Dollar', exponent: 2 },
    { code: 'cad', symbols: ['ca$'], name: 'Canada Dollar', exponent: 2 },
    { code: 'cdf', symbols: [], name: 'Congolese Franc', exponent: 2 },
    { code: 'chf', symbols: [], name: 'Switzerland Franc', exponent: 2 },
    { code: 'clp', symbols: [], name: 'Chile Peso', exponent: 2 },
    { code: 'cny', symbols: [], name: 'China Yuan Renminbi', exponent: 2 },
    { code: 'cop', symbols: [], name: 'Colombia Peso', exponent: 2 },
    { code: 'crc', symbols: ['₡'], name: 'Costa Rica Colon', exponent: 2 },
    { code: 'cup', symbols: ['₱'], name: 'Cuba Peso', exponent: 2 },
    { code: 'czk', symbols: ['kč'], name: 'Czech Republic Koruna', exponent: 2 },
    { code: 'djf', symbols: [], name: 'Djibouti Franc', exponent: 2 },
    { code: 'dkk', symbols: ['dkr'], name: 'Denmark Krone', exponent: 2 },
    { code: 'dop', symbols: ['rd$'], name: 'Dominican Republic Peso', exponent: 2 },
    { code: 'dzd', symbols: [], name: 'Algerian Dinar', exponent: 2 },
    { code: 'egp', symbols: ['£E', '￡E'], name: 'Egypt Pound', exponent: 2 },
    { code: 'ern', symbols: [], name: 'Nakfa', exponent: 2 },
    { code: 'etb', symbols: [], name: 'Ethiopian Birr', exponent: 2 },
    { code: 'eur', symbols: ['€'], name: 'Euro Member Countries', exponent: 2 },
    { code: 'fjd', symbols: ['fj$'], name: 'Fiji Dollar', exponent: 2 },
    { code: 'fkp', symbols: [], name: 'Falkland Islands (Malvinas) Pound', exponent: 2 },
    { code: 'gbp', symbols: ['£', '￡'], name: 'United Kingdom Pound', exponent: 2 },
    { code: 'gel', symbols: [], name: 'Georgia Lari', exponent: 2 },
    { code: 'ggp', symbols: [], name: 'Guernsey Pound', exponent: 2 },
    { code: 'ghs', symbols: ['¢'], name: 'Ghana Cedi', exponent: 2 },
    { code: 'gip', symbols: [], name: 'Gibraltar Pound', exponent: 2 },
    { code: 'gmd', symbols: [], name: 'Gambia Dalasi', exponent: 2 },
    { code: 'gnf', symbols: [], name: 'Guinea Franc', exponent: 2 },
    { code: 'gtq', symbols: ['q'], name: 'Guatemala Quetzal', exponent: 2 },
    { code: 'gyd', symbols: ['gy$'], name: 'Guyana Dollar', exponent: 2 },
    { code: 'hkd', symbols: ['hk$'], name: 'Hong Kong Dollar', exponent: 2 },
    { code: 'hnl', symbols: ['l'], name: 'Honduras Lempira', exponent: 2 },
    { code: 'hrk', symbols: ['kn'], name: 'Croatia Kuna', exponent: 2 },
    { code: 'huf', symbols: ['ft'], name: 'Hungary Forint', exponent: 2 },
    { code: 'idr', symbols: ['rp'], name: 'Indonesia Rupiah', exponent: 2 },
    { code: 'ils', symbols: ['₪'], name: 'Israel Shekel', exponent: 2 },
    { code: 'imp', symbols: [], name: 'Isle of Man Pound', exponent: 2 },
    { code: 'inr', symbols: ['rs'], name: 'India Rupee', exponent: 2 },
    { code: 'iqd', symbols: [], name: 'Iraqi Dinar', exponent: 2 },
    { code: 'irr', symbols: ['﷼'], name: 'Iran Rial', exponent: 2 },
    { code: 'isk', symbols: [], name: 'Iceland Krona', exponent: 2 },
    { code: 'jep', symbols: [], name: 'Jersey Pound', exponent: 2 },
    { code: 'jmd', symbols: ['j$'], name: 'Jamaica Dollar', exponent: 2 },
    { code: 'jod', symbols: [], name: 'Jordanian Dinar', exponent: 2 },
    { code: 'jpy', symbols: ['¥', '¥', '円'], name: 'Japan Yen', exponent: 2 },
    { code: 'kes', symbols: [], name: 'Kenyan Shilling', exponent: 2 },
    { code: 'kgs', symbols: ['лв'], name: 'Kyrgyzstan Som', exponent: 2 },
    { code: 'khr', symbols: ['៛'], name: 'Cambodia Riel', exponent: 2 },
    { code: 'kmf', symbols: [], name: 'Comoro Franc', exponent: 2 },
    { code: 'kpw', symbols: ['₩'], name: 'Korea (North) Won', exponent: 2 },
    { code: 'krw', symbols: ['₩'], name: 'Korea (South) Won', exponent: 2 },
    { code: 'kwd', symbols: [], name: 'Kuwaiti Dinar', exponent: 2 },
    { code: 'kyd', symbols: ['ky$'], name: 'Cayman Islands Dollar', exponent: 2 },
    { code: 'kzt', symbols: ['тг'], name: 'Kazakhstan Tenge', exponent: 2 },
    { code: 'lak', symbols: ['₭'], name: 'Laos Kip', exponent: 2 },
    { code: 'lbp', symbols: [], name: 'Lebanon Pound', exponent: 2 },
    { code: 'lkr', symbols: ['₨'], name: 'Sri Lanka Rupee', exponent: 2 },
    { code: 'lrd', symbols: ['lr$'], name: 'Liberia Dollar', exponent: 2 },
    { code: 'lsl', symbols: [], name: 'Lesotho Loti', exponent: 2 },
    { code: 'lyd', symbols: [], name: 'Libyan Dinar', exponent: 2 },
    { code: 'mad', symbols: ['dh', 'dhs'], name: 'Moroccan Dirham', exponent: 2 },
    { code: 'mdl', symbols: [], name: 'Moldovan Leu', exponent: 2 },
    { code: 'mga', symbols: [], name: 'Malagasy Ariary', exponent: 2 },
    { code: 'mkd', symbols: ['ден'], name: 'Macedonia Denar', exponent: 2 },
    { code: 'mmk', symbols: [], name: 'Myanmar Kyat', exponent: 2 },
    { code: 'mnt', symbols: ['₮'], name: 'Mongolia Tughrik', exponent: 2 },
    { code: 'mop', symbols: [], name: 'Macao Pataca', exponent: 2 },
    { code: 'mro', symbols: [], name: 'Mauritania Ouguiya', exponent: 2 },
    { code: 'mur', symbols: ['₨'], name: 'Mauritius Rupee', exponent: 2 },
    { code: 'mvr', symbols: [], name: 'Maldives Rufiyaa', exponent: 2 },
    { code: 'mwk', symbols: [], name: 'Malawi Kwacha', exponent: 2 },
    { code: 'mxn', symbols: [], name: 'Mexico Peso', exponent: 2 },
    { code: 'myr', symbols: ['rm'], name: 'Malaysia Ringgit', exponent: 2 },
    { code: 'mzn', symbols: ['mt'], name: 'Mozambique Metical', exponent: 2 },
    { code: 'nad', symbols: ['na$'], name: 'Namibia Dollar', exponent: 2 },
    { code: 'ngn', symbols: ['₦'], name: 'Nigeria Naira', exponent: 2 },
    { code: 'nio', symbols: ['c$'], name: 'Nicaragua Cordoba', exponent: 2 },
    { code: 'nok', symbols: [], name: 'Norway Krone', exponent: 2 },
    { code: 'npr', symbols: ['₨'], name: 'Nepal Rupee', exponent: 2 },
    { code: 'nzd', symbols: ['nz$'], name: 'New Zealand Dollar', exponent: 2 },
    { code: 'omr', symbols: ['﷼'], name: 'Oman Rial', exponent: 2 },
    { code: 'pab', symbols: ['b/.'], name: 'Panama Balboa', exponent: 2 },
    { code: 'pen', symbols: ['s/.'], name: 'Peru Sol', exponent: 2 },
    { code: 'pgk', symbols: [], name: 'Papua New Guinea Kina', exponent: 2 },
    { code: 'php', symbols: ['₱'], name: 'Philippines Peso', exponent: 2 },
    { code: 'pkr', symbols: ['₨'], name: 'Pakistan Rupee', exponent: 2 },
    { code: 'pln', symbols: ['zł'], name: 'Poland Zloty', exponent: 2 },
    { code: 'pyg', symbols: ['gs'], name: 'Paraguay Guarani', exponent: 2 },
    { code: 'qar', symbols: ['﷼'], name: 'Qatar Riyal', exponent: 2 },
    { code: 'ron', symbols: ['lei'], name: 'Romania New Leu', exponent: 2 },
    { code: 'rsd', symbols: ['дин'], name: 'Serbia Dinar', exponent: 2 },
    { code: 'rub', symbols: ['₽'], name: 'Russia Ruble', exponent: 2 },
    { code: 'rwf', symbols: [], name: 'Rwanda Franc', exponent: 2 },
    { code: 'sar', symbols: ['﷼'], name: 'Saudi Arabia Riyal', exponent: 2 },
    { code: 'sbd', symbols: ['sb$'], name: 'Solomon Islands Dollar', exponent: 2 },
    { code: 'scr', symbols: ['₨'], name: 'Seychelles Rupee', exponent: 2 },
    { code: 'sdg', symbols: [], name: 'Sudanese Pound', exponent: 2 },
    { code: 'sek', symbols: ['kr'], name: 'Sweden Krona', exponent: 2 },
    { code: 'sgd', symbols: ['sg$'], name: 'Singapore Dollar', exponent: 2 },
    { code: 'shp', symbols: [], name: 'Saint Helena Pound', exponent: 2 },
    { code: 'sll', symbols: [], name: 'Sierra Leone', exponent: 2 },
    { code: 'sos', symbols: ['s'], name: 'Somalia Shilling', exponent: 2 },
    { code: 'srd', symbols: ['sr$'], name: 'Suriname Dollar', exponent: 2 },
    { code: 'ssp', symbols: [], name: 'South Sudanese Pound', exponent: 2 },
    { code: 'std', symbols: [], name: 'Sao Tome and Principe Dobra', exponent: 2 },
    { code: 'svc', symbols: [], name: 'El Salvador Colon', exponent: 2 },
    { code: 'syp', symbols: [], name: 'Syria Pound', exponent: 2 },
    { code: 'szl', symbols: [], name: 'Swaziland Lilangeni', exponent: 2 },
    { code: 'thb', symbols: ['฿'], name: 'Thailand Baht', exponent: 2 },
    { code: 'tjs', symbols: [], name: 'Tajikistan Somoni', exponent: 2 },
    { code: 'tmt', symbols: [], name: 'Turkmenistan New Manat', exponent: 2 },
    { code: 'tnd', symbols: [], name: 'Tunisian Dinar', exponent: 2 },
    { code: 'try', symbols: [], name: 'Turkey Lira', exponent: 2 },
    { code: 'ttd', symbols: ['tt$'], name: 'Trinidad and Tobago Dollar', exponent: 2 },
    { code: 'tvd', symbols: ['tv$'], name: 'Tuvalu Dollar', exponent: 2 },
    { code: 'twd', symbols: ['nt$'], name: 'Taiwan New Dollar', exponent: 2 },
    { code: 'tzs', symbols: [], name: 'Tanzanian Shilling', exponent: 2 },
    { code: 'uah', symbols: ['₴'], name: 'Ukraine Hryvnia', exponent: 2 },
    { code: 'ugx', symbols: [], name: 'Uganda Shilling', exponent: 2 },
    { code: 'usd', symbols: ['$', '﹩', '＄', 'us$'], name: 'United States Dollar', exponent: 2 },
    { code: 'uyu', symbols: ['$u'], name: 'Uruguay Peso', exponent: 2 },
    { code: 'uzs', symbols: ['лв'], name: 'Uzbekistan Som', exponent: 2 },
    { code: 'vef', symbols: ['bs'], name: 'Venezuela Bolivar', exponent: 2 },
    { code: 'vnd', symbols: ['₫'], name: 'Viet Nam Dong', exponent: 2 },
    { code: 'vuv', symbols: [], name: 'Vanuatu Vatu', exponent: 2 },
    { code: 'wst', symbols: [], name: 'Samoa Tala', exponent: 2 },
    { code: 'xaf', symbols: [], name: 'Central African Franc', exponent: 2 },
    { code: 'xcd', symbols: ['xc$'], name: 'East Caribbean Dollar', exponent: 2 },
    { code: 'xof', symbols: [], name: 'West African Franc', exponent: 2 },
    { code: 'xpf', symbols: [], name: 'CFP Franc', exponent: 2 },
    { code: 'yer', symbols: ['﷼'], name: 'Yemen Rial', exponent: 2 },
    { code: 'zar', symbols: ['r'], name: 'South Africa Rand', exponent: 2 },
    { code: 'zmw', symbols: [], name: 'Zambian Kwacha', exponent: 2 },
    { code: 'zwd', symbols: ['z$'], name: 'Zimbabwe Dollar', exponent: 2 },
    { code: 'zwl', symbols: [], name: 'Zimbabwe Dollar', exponent: 2 },
];

/* eslint-disable quotes */

const currencies = currencies$1;

// Construct regular expressions

const allSymbols = currencies
    .reduce((syms, curr) => syms.concat(curr.code).concat(curr.symbols), [])
    .map(sym => sym.replace(/([\$\.])/g, '\\$1'))
    .join('|');
const minuses = '[−–‑—‒-]';
const delimiters = `[\\s.,\\'‘’‛′´\`]`;
const numGroup = `(\\s*\\d+(?:${delimiters}*\\d+)*)`;
const symGroup = `(${allSymbols})`;

const leadingSym = [minuses + '?', symGroup, minuses + '?', numGroup].join('\\s*');
const trailingSym = [minuses + '?', numGroup, symGroup].join('\\s*');

const startDelimiter = '(?:^|\\s+)';
const endDelimiter = `(?=$|\\s+|[,;:\\!\\?\\.\\'"\\+\\-])`;
const mainGroups = `(?:\\s*${[leadingSym, trailingSym].join('|')})`;

const priceRegex = new RegExp(`${startDelimiter}${mainGroups}${endDelimiter}`, 'ig');
var parseFirst_1 = parseFirst;

function parseFirst(text, options = {}) {
    text = String(text || '');
    if (!text) {
        return null;
    }
    priceRegex.lastIndex = 0;
    const m = priceRegex.exec(text);
    return m ? matchResultToPrice(m, options) : null;
}

function matchResultToPrice(match, options = {}) {
    const {
        parseNegative = false,
    } = options;
    const isNegative = new RegExp(minuses).test(match[0]);
    const symbol = (match[1] || match[4] || '').toLowerCase();
    const currency = currencies.find(cur => cur.code === symbol ||
        cur.symbols.indexOf(symbol) > -1);
    if (!currency) {
        // Assertion note: this should not happen if regex are assembled correctly
        // tests should cover that
        return null;
    }
    const exponent = currency.exponent;
    const sign = parseNegative && isNegative ? -1 : 1;
    const floatValue = sign * parseNumber(match[2] || match[3], exponent);
    const value = Math.round(floatValue * Math.pow(10, exponent));
    return {
        value,
        floatValue,
        symbol,
        currencyCode: currency.code,
        currency,
    };
}

function parseNumber(str, exponent) {
    const chunks = str.split(new RegExp(delimiters + '+'));
    const num = parseInt(chunks.join(''));
    const lastChunk = chunks[chunks.length - 1];
    const hasDecimalPoint = chunks.length > 1 &&
        lastChunk.length <= exponent;
    const actualExponent = lastChunk.length;
    return hasDecimalPoint ? num / Math.pow(10, actualExponent) : num;
}

var amazon = {
    test(url) {
        return url.host.includes('amazon');
    },
    preset(window) {
        try {
            return {
                title: elementValue(window, '[name="productTitle"]'),
                price: parseFloat(elementValue(window, '[name="priceValue"]')),
                priceCurrency: elementValue(window, '[name="currencyOfPreference"]'),
                image: elementValue(window, '[name="productImageUrl"]').replace('._SS75_', ''),
            };
        }
        catch (_a) {
            const $parseCurrency = parseFirst_1(elementTextContent(window, [
                // Main selector (most reliable since it uses data-* selector)
                "span[data-a-color='price'] span.a-offscreen",
                // Backup selectors below (ordered from most reliable to least)
                "span#tp_price_block_total_price_ww span.a-offscreen",
                "span#tp-tool-tip-subtotal-price-value span.a-offscreen",
                "#rightCol .a-price .a-offscreen",
                // TODO: delete if not working at all [START]
                "#priceblock_ourprice",
                ".a-price.a-text-price span",
                "#kindle-price",
                // TODO: delete if not working at all [END]
            ].join(',')));
            return {
                title: elementTextContent(window, '#productTitle'),
                price: $parseCurrency.floatValue,
                priceCurrency: elementValue(window, 'input[id*="currency"],input[name*="currency"]') || $parseCurrency.currencyCode.toUpperCase(),
                image: elementAttribute(window, 'src', ["#landingImage", "#imgBlkFront", "#ebooksImgBlkFront"].join(',')),
            };
        }
    },
};

function run(window) {
    var _a;
    const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
    // try {
    let product = jsonld(window) || microdata(window);
    const meta$1 = meta(window);
    if (!product) {
        if (amazon.test(window.location)) {
            product = amazon.preset(window);
        }
    }
    if (!(meta$1 === null || meta$1 === void 0 ? void 0 : meta$1.url)) {
        meta$1.url = window.document.URL;
    }
    if (product) {
        if (!product.url) {
            product.url = meta$1.url || window.document.URL;
        }
        if (!product.image || ((_a = product.image) === null || _a === void 0 ? void 0 : _a.startsWith('data:'))) {
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
