import * as fs from "fs";
import { generateAPIKey, resourceGetTreeLevel, documentGetVariableValues, documentSetVariableDefinitions } from "./chili.js";
import { buildBaseURL, getResourceInfo } from "./utils.js";

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const variableDef = fs.readFileSync('requestBody.xml', 'utf-8');
const baseurl = buildBaseURL(config.environment, config.isSandbox);

// Get API key
let apikey;
if (config.auth.apikey.trim() != "") {
    apikey = config.auth.apikey;
}
else {
    const apikeyFetch = await generateAPIKey(config.auth.user, config.auth.pass, config.environment, baseurl);
    apikey = apikeyFetch.isOK ? apikeyFetch.response : "FAILED";
    if (apikey == "FAILED") {
        throw new Error(apikeyFetch.error);
    }
}

// Get list of document IDs
const initialTreeFetch = await resourceGetTreeLevel('documents', config.targetDirectory, apikey, baseurl);
const initialTree = initialTreeFetch.isOK ? initialTreeFetch.response : "FAILED";
if (initialTree == "FAILED") {
    throw new Error(initialTreeFetch.error);
}
const docs = await getResourceInfo(initialTree, 'documents', [], apikey, baseurl);

// Check each document in list
for (let i = 0; i < docs.length; i++) {
    // Check variables values to see if variable to swap exists
    const varValuesFetch = await documentGetVariableValues(docs[i].id, apikey, baseurl);
    const varValues = varValuesFetch.isOK ? varValuesFetch.response : "FAILED";
    if (varValues == "FAILED") {
        throw new Error(varValuesFetch.error);
    }
    let containsVar = false;
    console.log(varValues.item);
    if(varValues.item != null) {
        if(varValues.item.length != null){
            varValues.item.forEach(v => {
                if(v.name == config.targetVariable) {
                    containsVar = true;
                }
            });
        } else {
            if(varValues.item.name == config.targetVariable) {
                containsVar = true;
            }
        }
    }
    // Update variable definition if variable exists
    if(containsVar){
        await documentSetVariableDefinitions(docs[i].id, variableDef, apikey, baseurl);
    }
}