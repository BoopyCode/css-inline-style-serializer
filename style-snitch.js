// style-snitch.js - Because sometimes CSS needs to confess everything
// Usage: styleSnitch(document.querySelector('#your-element'))

function styleSnitch(element) {
    // If you're looking at the console, CSS did something naughty
    if (!element) {
        console.warn('Element not found. Did CSS hide it? Typical.');
        return null;
    }

    // Get all the juicy computed styles (CSS's dirty laundry)
    const styles = window.getComputedStyle(element);
    const styleObj = {};
    
    // Convert CSSStyleDeclaration to a normal object
    // Because arrays are for people who know what they're doing
    for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        styleObj[prop] = styles.getPropertyValue(prop);
    }

    // Sort alphabetically because chaos is for layout engines
    const sortedStyles = {};
    Object.keys(styleObj).sort().forEach(key => {
        sortedStyles[key] = styleObj[key];
    });

    // Output options for your debugging pleasure
    return {
        // The whole shebang
        all: sortedStyles,
        
        // Just the non-default values (where the real crimes happen)
        nonDefault: Object.keys(sortedStyles)
            .filter(key => sortedStyles[key] !== '' && !sortedStyles[key].startsWith('0px'))
            .reduce((obj, key) => {
                obj[key] = sortedStyles[key];
                return obj;
            }, {}),
        
        // Quick summary for when you're in a hurry
        summary: `Element: ${element.tagName}${element.id ? '#' + element.id : ''}${element.className ? '.' + element.className : ''}\n` +
                 `Total styles: ${Object.keys(sortedStyles).length}\n` +
                 `Probably broken because: ${guessCulprit(sortedStyles)}`
    };
}

// Because blaming random properties is a time-honored tradition
function guessCulprit(styles) {
    const suspects = [
        { prop: 'display', clue: 'display issues (shocking!)' },
        { prop: 'position', clue: 'positioning drama' },
        { prop: 'float', clue: '1998 called, wants its layout back' },
        { prop: 'z-index', clue: 'z-index wars (it's always z-index)' },
        { prop: 'margin', clue: 'margin collapse shenanigans' },
        { prop: 'flex', clue: 'flexbox confusion' },
        { prop: 'grid', clue: 'grid grief' }
    ];
    
    for (let suspect of suspects) {
        if (styles[suspect.prop] && styles[suspect.prop] !== 'auto') {
            return suspect.clue;
        }
    }
    
    return 'CSS being CSS (probably IE's fault somehow)';
}

// Bonus: Quick console command for the lazy developer
console.snitch = function(selector) {
    const el = document.querySelector(selector);
    const result = styleSnitch(el);
    console.log('🎨 Style Snitch Report:');
    console.log(result.summary);
    console.log('Full confession:', result.all);
    return result;
};

// Export for module systems (optional optimism)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { styleSnitch };
}