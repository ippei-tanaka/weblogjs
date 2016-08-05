import showdown from 'showdown';
import highlight from 'highlight.js';

const htmlunencode = (text) => text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

showdown.extension('codehighlight', () =>
{
    return [
        {
            type: 'output',
            filter: (text, converter, options) =>
            {
                const left = '<pre><code\\b[^>]*>';
                const right = '</code></pre>';
                const flags = 'g';
                const replacement = (wholeMatch, match, left, right) =>
                {
                    // unescape match to prevent double escaping
                    match = htmlunencode(match);

                    let languageName = "";

                    if (/class="(.+)"/.test(left))
                    {
                        const className = RegExp.$1;
                        left = left.replace(/class=".+"/, `class="${className} hljs"`)

                        if (/language-([^\s]+)/.test(className) && highlight.getLanguage(RegExp.$1))
                        {
                            languageName = RegExp.$1;
                        }
                    }

                    const highlighten = languageName
                        ? highlight.highlight(languageName, match)
                        : highlight.highlightAuto(match);

                    return left + highlighten.value + right;
                };

                return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
            }
        }
    ];
});
