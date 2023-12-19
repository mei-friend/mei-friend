const lc_endpoint = "https://luteconv.mdw.ac.at";
//const lc_endpoint = "https://staging.luteconv.mdw.ac.at";
//const lc_endpoint = "http://localhost:3100";

export async function luteconv(sourceData, fName, endpoint = lc_endpoint) {
    console.log("Converting to MEI with luteconv...", typeof sourceData, sourceData, fName);
    const blob = new Blob([sourceData], {type: 'application/gzip'});

    const formData  = new FormData();
    formData.append('file', blob, fName);
    formData.append('dstformat', 'mei');
    formData.append('output', fName);
    
    const response = await fetch(lc_endpoint + "/process", {
        method: 'POST',
        body: formData,
        headers: { 
            'Accept': 'application/json'
        }
    });
    console.log("Received a response!", response)
    const json = await response.json();
    if("download_link" in json) { 
        // success!
        const meiResponse = await fetch(lc_endpoint + json.download_link);
        const mei = await meiResponse.text();
        return mei;
    } else { 
        // error
        console.error("LuteConv error: ", json);
        return null;
    }
}