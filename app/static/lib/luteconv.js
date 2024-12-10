const lc_endpoint = 'https://luteconv.mdw.ac.at';
//const lc_endpoint = "https://staging.luteconv.mdw.ac.at";
//const lc_endpoint = "http://localhost:3100";

/**
 *
 * @param {ArrayBuffer} sourceData  - the source data to be converted, as an ArrayBuffer
 * @param {*} fName  - the filename of the source data
 * @param {*} endpoint - the endpoint of the luteconv server
 * @returns {Promise<string>} - the converted MEI data as a string
 */
export async function luteconv(sourceData, fName, endpoint = lc_endpoint) {
  // strip any subdirectories and keep only the filename
  fName = fName.split('/').pop();
  // URI-encode the filename to avoid problems with special characters
  fName = encodeURIComponent(fName);
  console.log('Converting to MEI with luteconv...', typeof sourceData, sourceData, fName);
  const blob = new Blob([sourceData], { type: 'application/gzip' });

  const formData = new FormData();
  formData.append('file', blob, fName);
  formData.append('dstformat', 'mei');
  formData.append('output', fName);

  const response = await fetch(endpoint + '/process', {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  });
  console.log('Received a response!', response);
  const json = await response.json();
  if ('download_link' in json) {
    // success!
    const meiResponse = await fetch(lc_endpoint + json.download_link);
    const mei = await meiResponse.text();
    return mei;
  } else {
    // error
    console.error('LuteConv error: ', json);
    return null;
  }
}
