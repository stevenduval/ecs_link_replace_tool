//set reusable variables
const findlinksBtn =  document.querySelector('.findlinks');
const updatelinksBtn =  document.querySelector('.updatelinks');
const saveBtn =  document.querySelector('.save');
const reloadBtn =  document.querySelector('.reload');
const input = document.querySelector('#input');
const output = document.querySelector('#output');


// run when save output is clicked
const saveOutput = () => { 
    const text = output.querySelector("textarea").value.replace(/\n/g, "\r\n"); // To retain the Line breaks.
    const blob = new Blob([text], { type: "text/plain"});
    const anchor = document.createElement("a");
    const date = new Date().toLocaleString('en-ca').split(",")[0].replace(/-/g,"_");
    anchor.download = `ecs_team_tool_output_${date}.txt`;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target ="_blank";
    anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}
// run when more than 1 character is typed in the box
const characterCount = () => {
    const inputLength = input.querySelector('textarea').value.length;
    const characterCountSpan = input.querySelectorAll('span')[1];
    characterCountSpan.innerText = (inputLength > 0) ? `Character Count : ${inputLength}` : '';
}

const showLinks = () => {
    // clear link area and count if button is clicked again
    document.querySelector('.link-count').innerHTML = '';
    document.querySelector('.link-area').innerHTML = '';
    //set reuseable variables
    const getBody = input.querySelector('textarea').value.match(/(<body[^]*)/g).toString();
    const getLinks = getBody.match(/(href\s*=\s*["])([^]*?)(?:["][^]*?)/g);
	const links = getLinks.map(link => (/""/g.test(link)) ? link.replace(/href\=/g,"").replace(/""/g,"blank href tag") : link.replace(/href\=/g,"").replace(/"/g,""));
    // place count of links into the DOm
    document.querySelector('.link-count').innerText = `${getLinks.length} link(s) found in the HTML :`; 
    // create div elements for each link in the links array
    links.forEach(link => { 
        document.querySelector('.link-area')
            .insertAdjacentHTML('beforeend', 
                `<div class="link">
                    <div class="link-container">
                        <div class="currentLink">
                            <span>Current Link :</span><input type="text" readonly>
                        </div>
                        <div class="newLink">
                            <span>New Link :</span><input type="text">
                        </div>
                    </div>
                </div>`
            )
    });
    // insert link into input value *reason for this is so insertAdjacentHTML doesnt parse html entities as html characters*
    links.forEach((link,index) => {
        document.querySelectorAll('.link-area > .link > .link-container > .currentLink > input')[index].value = link;
        document.querySelectorAll('.link-area > .link > .link-container > .newLink > input')[index].value = link;
    });
}

const updateLinks = () => {
    // set reusable variables
    const getNewLinks = document.querySelectorAll('.newLink > input');
    const getNewLinksValues = [];
    const getHeader = input.querySelector('textarea').value.match(/<[^]*(?=<body)/g).toString();
    const getBody = input.querySelector('textarea').value.match(/(<body[^]*)/g).toString();
    let i = 0;
    // for each new link, push it to an array
    getNewLinks.forEach( link => getNewLinksValues.push(link.value));
    // function to add href to new link values
    const returnFinalURLs = (url) => { 
        i++ 
        return 'href="' + getNewLinksValues[i-1] + '"' 
    };
    // replace urls with new url values
    const replacedLinks = getBody.replace(/(href\s*=\s*["])([^]*?)(?:["][^]*?)/g, returnFinalURLs)
    // set output area value
    output.querySelector('textarea').value = getHeader+replacedLinks;
}

// event listeners
findlinksBtn.addEventListener('click', showLinks);
updatelinksBtn.addEventListener('click', updateLinks);
saveBtn.addEventListener('click', saveOutput);
reloadBtn.addEventListener('click', () => location.reload(true));
input.querySelector('textarea').addEventListener('keyup', characterCount);
