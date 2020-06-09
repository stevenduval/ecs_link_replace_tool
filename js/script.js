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
    
    // clear previous items if button is clicked again
    document.querySelector('.link-count').innerHTML = '';
    document.querySelector('.link-area').innerHTML = '';
    
    const findLinks = input.querySelector('textarea').value.match(/(href\s*=\s*['"])([^]*?)(?:['"][^]*?)/g);
	document.querySelector('.link-count').innerText = `${findLinks.length} link(s) found in the HTML :`; 
    
	findLinks
		.map(link => (/""/g.test(link)) ? link.replace(/href\=/g,"").replace(/""/g,"blank href tag") : link.replace(/href\=/g,"").replace(/"/g,""))
		.forEach( link => {
                            document.querySelector('.link-area')
                                .insertAdjacentHTML('beforeend', 
                                                        `<div class="link">
                                                            <div class="link-container">
                                                                <div class="currentLink">
                                                                    <span>Current Link :</span><input type="text" value="${link}" readonly>
                                                                </div>
                                                                <div class="newLink">
                                                                    <span>New Link :</span><input type="text" value="${link}">
                                                                </div>
                                                            </div>
                                                        </div>`)
        });
}

const updateLinks = () => {
    let i = 0;
    const getNewLink = document.querySelectorAll('.newLink > input');
    const getNewLinkValues = [];
    getNewLink.forEach( link => getNewLinkValues.push(link.value));
    const returnURL = (url) => { 
        i++ 
        return 'href="' + getNewLinkValues[i-1] + '"' 
    };
    output.querySelector('textarea').value = input.querySelector('textarea').value.replace(/(href\s*=\s*['"])([^]*?)(?:['"][^]*?)/g, returnURL);
}

//event listeners
findlinksBtn.addEventListener('click', showLinks);
updatelinksBtn.addEventListener('click', updateLinks);
saveBtn.addEventListener('click', saveOutput);
reloadBtn.addEventListener('click', () => location.reload(true));
input.querySelector('textarea').addEventListener('keyup', characterCount);
