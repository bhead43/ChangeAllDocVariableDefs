import { jsonifyChiliResponse } from "./utils.js";

// Get API key
export async function generateAPIKey(user, pass, environment, url) {
    // Rewrite to better handle errors
    let result = {
        response: "",
        isOK: false,
        error: "",
    };

    try {
        const response = await fetch(
            url + `/system/apikey?environmentNameOrURL=${environment}`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ userName: user, password: pass }),
            },
        );

        if (!response.ok) {
            result.isOK = false;
            result.error = Error(`GenerateApiKey failed with message: ${response.status} ${response.statusText}, ${await response.text()}`);
        } else {
            const responseJSON = jsonifyChiliResponse(await response.text());
            if (responseJSON.succeeded == "false") {
                result.isOK = false;
                result.error = Error(responseJSON.errorMessage);
            } else {
                result.isOK = true;
                result.response = responseJSON.key;
            }
        }
    } catch (err) {
        result.isOK = false;
        result.error = err;
    }
    return result;
}

// Get tree level
export async function resourceGetTreeLevel(type, path, apikey, url) {
    let result = {
        response: "",
        isOK: false,
        error: ""
    };
    try {
        const response = await fetch(
            url + `/resources/${type}/treelevel?parentFolder=${path}&numLevels=1&includeSubDirectories=true&includeFiles=true`, {
            method: "GET",
            headers: {
                "api-key": apikey
            }
        });
        if (!response.ok) {
            result.isOK = false;
            result.error = Error(`ResourceGetTreeLevel failed with message: ${response.status} ${response.statusText}, ${await response.text()}\nURL: ${url + `/resources/${type}/treelevel?parentFolder=${path}&numLevels=1&includeSubDirectories=true&includeFiles=true`}`);
        } else {
            const responseJSON = jsonifyChiliResponse(await response.text());
            result.isOK = true;
            result.response = responseJSON;
        }
    } catch (err) {
        result.isOK = false;
        result.error = err;
    }
    return result;
}

// Set variable definitions
export async function documentSetVariableDefinitions(id, variableDefinition, apikey, url) {
    let result = {
        response: "",
        isOK: false,
        error: ""
    };
    try {
        const response = await fetch(
            url + `/resources/documents/${id}/variabledefinitions?replaceExistingVariables=false`, {
            method: "POST",
            headers: {
                "api-key": apikey,
                "content-type": "application/json"
            },
            body: JSON.stringify({ definitionXML: variableDefinition })
        });
        if (!response.ok) {
            result.isOK = false;
            result.error = Error(`DocumentSetVariableValues failed with message: ${response.status} ${response.statusText}, ${await response.text()}`);
        } else {
            result.isOK = true;
            result.response = await response.text();
        }
    } catch (err) {
        result.isOK = false;
        result.error = err;
    }
    return result;
}

// Get variable values
export async function documentGetVariableValues(id, apikey, url) {
    let result = {
        response: "",
        isOK: false,
        error: ""
    };
    try {
        const response = await fetch(
            url + `/resources/documents/${id}/variablevalues`, {
            method: "GET",
            headers: {
                "api-key": apikey
            }
        });
        if (!response.ok) {
            result.isOK = false;
            result.error = Error(`DocumentGetVariableValues failed with message: ${response.status} ${response.statusText}, ${await response.text()}`);
        } else {
            const responseJSON = jsonifyChiliResponse(await response.text());
            result.isOK = true;
            result.response = responseJSON;
        }
    } catch (err) {
        result.isOK = false;
        result.error = err;
    }
    return result;
}

// Get variable definitions
export async function documentGetVariableDefinitions(id, apikey, url) {
    let result = {
        response: "",
        isOK: false,
        error: ""
    };
    try {
        const response = await fetch(
            url + `/resources/documents/${id}/variabledefinitions`, {
            method: "GET",
            headers: {
                "api-key": apikey
            }
        });
        if (!response.ok) {
            result.isOK = false;
            result.error = Error(`DocumentGetVariableDefinitions failed with message: ${response.status} ${response.statusText}, ${await response.text()}`);
        } else {
            const responseJSON = jsonifyChiliResponse(await response.text());
            result.isOK = true;
            result.response = responseJSON;
        }
    } catch (err) {
        result.isOK = false;
        result.error = err;
    }
    return result;
}