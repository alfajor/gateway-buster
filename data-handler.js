/* TODO:     
    * fix connection dropping on consecutive post req, delay in updating new post 
    * rendered article formatting - paragraph breaks, extraneous punctuation
    * extend: parse more articles and articles from other sites w/similar pre-rendered data - tabbed menu?
*/

import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { writeData } from './write-data.js';

// dynamic import from write file
const articleRaw = await import('./public/js/data.js');

export const getArticleData = async (url) => {
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36' 
        }
    });
    const articleBody = await res.text();
    return articleBody;
}

export const renderArticleData = async (url) => {
    const articleBody = await getArticleData(url)
    // parse html
    const DOMroot = parse(articleBody);
    const docBody = DOMroot.getElementsByTagName('body');
 
    let bodyText;
    let headingText;
    let summaryText;
 
    return docBody.map((el) => { 
        const targetScript = el.getElementsByTagName('script')[0];
        targetScript.setAttribute('type', 'application/json');
 
        const rawText = targetScript.textContent.slice(targetScript.textContent.indexOf('=') + 1);
 
        // write file
        writeData('/public/js/data.js', rawText)

        // begin article render if target var is set
        if (articleRaw.articleRaw) {
            const articleData = articleRaw.articleRaw.initialData.data.article.sprinkledBody.content;
            const headers = articleData.filter((item) => item.__typename === 'HeaderBasicBlock');
            const article = articleData.filter((item) => item.__typename == 'ParagraphBlock');
        
            const headingsBlock = new Object;
        
            headers.map((item) => item.headline.content.map((head) => headingText = head.text));
           // headers.map((item) => item.summary.content.map((summary) => summaryText = summary.text));
        
            headingsBlock.heading = headingText;
            headingsBlock.summary = summaryText;
        
            const articleTitle = headingText ? headingText : '';
            const articleSummary = summaryText ? summaryText : '';
    
            return `${articleTitle} \n ${articleSummary} \n ${article.map((item) => item.content.map((el) => bodyText = el.text))}`;
        } else {
            return 'Unable to render complete article. Please try submitting again.'
        }
    });
}