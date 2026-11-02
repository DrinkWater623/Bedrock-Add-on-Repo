//@ts-check
/*
=====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
========================================================================
*/
//=====================================================================
class FetchSiteJsonStack {
    /**
     *
     * @param {string[]} sites
     */
    constructor(sites = []) {
        this.fetchStack = sites
            .filter(v => typeof v === "string")
            .filter(v => v.length > 0)
            .map(site => this.#siteObj(site));
    }
    promiseStack = [];
    //--------------------------------------
    debugOn = false;
    #colorReset = '\x1b[0m';
    #colorMap = new Map(
        [
            [ "bold", 97 ],
            [ "error", 91 ],
            [ "highlight", 47 ],
            [ "log", 38 ],
            [ "mute", 90 ],
            [ "success", 92 ],
            [ "warn", 93 ]
        ]
    );
    #colorString (colorName) {
        return "\x1b[" + this.#colorMap.get(colorName) + "m%s";
    }
    //--------------------------------------    
    #siteObj (site) {
        return {
            site: site,
            success: false,
            data: {},
            dataType: "Unknown",
            err: ""
        };
    }
    //add fetchSiteDel....
    fetchAdd (...sites) {
        sites
            .filter(v => typeof v === "string")
            .filter(v => v.length > 0)
            .forEach(site => this.fetchStack.push(this.#siteObj(site)));
    }
    #fetchNext () {
        if (this.fetchStack.length === 0) return;

        let ctr=0;
        let errCode = this.#colorString("error");
        let warnCode = this.#colorString("warn");
        let successCode = this.#colorString("success");

        let newFetch = this.fetchStack.shift();
        if (typeof newFetch != "object") return;

        //should this be b4 the pop?  not sure
        this._preFetchEach(newFetch);
        //because user could alter the object
        if (!("site" in newFetch) || newFetch.site.length === 0) {
            if (this.fetchStack.length) this.#fetchNext();
            return;
        }

        if (this.debugOn) console.log(this.#colorString("bold"), "==> Fetching Site:", newFetch.site, this.#colorReset);

        fetch(newFetch.site)
            .then(response => {
                let returnedJson = {};

                if (response.ok) {
                    newFetch.success = true;
                    console.log(this.#colorString("success"), "==> Fetch Successful:", newFetch.site, this.#colorReset);
                    //FIXME:              
                    try {

                        returnedJson = response.json()
                        //console.log(`typeof returnedText: ${typeof returnedText}`,returnedText)
                        //fs.writeFileSync(`./data_${ctr++}.txt`,returnedText)

                        // try {
                        //     const testJson = JSON.parse(returnedText);
                        //     returnedJson = testJson;
                        //     newFetch.dataType = 'json';
                        // } catch (err) {
                        //     console.error(`NOT JSON:`,err)
                        // }  
                    }
                    catch (err) {
                        console.error(this.#colorString("error"), "xx> Not a JSON Site:", newFetch.site, err,this.#colorReset);
                    }
                }
                else {
                    newFetch.success = false;
                    console.warn(this.#colorString("warn"), "xx> Fetch Response Not-Ok:", newFetch.site, this.#colorReset);
                }
                return returnedJson;
            })
            .then(data => {
                if (newFetch.success)
                    newFetch.data = data;
            })
            .catch(error => {
                newFetch.err = error;
                if (this.debugOn) console.error(this.#colorString("error"), "xx> Fetch Error:", error, this.#colorReset);
            })
            .finally(() => {
                this.promiseStack.push(newFetch);

                this._postPromiseEach();

                if (this.fetchStack.length)
                    this.#fetchNext();
                else {
                    //if (this.debugOn) console.log(this.#colorString("success"), "==> Fetch Stack is Now Empty!");
                    if (this.debugOn) console.log(this.#colorString("mute"), "<== fetchNext()");
                    this._postPromiseAll();
                }
            });
    }
    fetchesStart () {
        if (this.debugOn) console.log("==> fetchStart()");
        if (this.fetchStack.length > 0)
            this.#fetchNext();


        else
            console.warn(this.#colorString("warn"), "xx> Fetch List is Empty");
    }
    consoleLogFetchList () {
        if (this.debugOn) console.log(this.#colorString("bold"), "* consoleLogFetchList()", "length:", this.fetchStack.length);
        let list = [];
        this.fetchStack.forEach(v => list.push(v.site));
        if (list.length > 0) console.table(list);
        else if (this.debugOn) console.warn(this.#colorString("warn"), "Fetch List is Empty");
    }
    consoleLogPromiseList () {
        if (this.debugOn) console.log(this.#colorString("bold"), "* consoleLogPromiseList()", "length:", this.promiseStack.length);
        let list = [];
        this.promiseStack.forEach(v => list.push(
            {
                Retrieved: v.success,
                DataType: v.dataType,
                Site: v.site
            }));
        if (list.length > 0) console.table(list);
        else if (this.debugOn) console.warn(this.#colorString("warn"), "==> Response List is Empty");
    }
    //for Json Data Only else will fail
    consoleLogPromiseKeys () {
        if (this.debugOn) console.log(this.#colorString("bold"), "* consoleLogPromiseKeys()", "length:", this.promiseStack.length);
        if (this.promiseStack.length == 0) {
            if (this.debugOn) console.warn(this.#colorString("warn"), "==> Response List is Empty");
            return;
        }
        for (let i in this.promiseStack) {
            let obj = this.promiseStack[ i ];

            if (obj.success) {
                console.info(this.#colorString("success"), "Site:", obj.site, this.#colorReset);
                const keys = Object.keys(obj.data);
                console.table(keys);
            }


            else
                console.error(this.#colorString("error"), "Failed Site:", obj.site, "Err:", obj.err, this.#colorReset);
        }
    }
    //--------------------------------------------------------------
    //Expecting Class user to Overwrite these in their extended copy
    //--------------------------------------------------------------
    /*
    This is called after each fetch is done whether it failed or not.
    This is how you can use your extend class functions in between fetches
    i.e. you extended the constructor and want to add properties and update them
    i.e. change the fetch stack based on response information
    */
    _preFetchEach (fetchObj) {
        if (this.promiseStack.length === 0) {
            if (this.debugOn) {
                console.warn(this.#colorString("warn"), "* _preFetchEach(fetchObj) is called before every site fetch.");
                console.warn(this.#colorString("warn"), "\tReplace it in your Extended class");
            }
        }
    }
    /*
    This is called after each promise is returned, whether it failed or not.
    This is how you can use your extend class functions in between fetches
    i.e. you extended the constructor and want to add properties and update them
    i.e. change the fetch stack based on response information
    */
    _postPromiseEach () {
        if (this.promiseStack.length === 1) {
            if (this.debugOn) {
                console.warn(this.#colorString("warn"), "* _postPromiseEach() is called after the returned promise of every fetch.");
                console.warn(this.#colorString("warn"), "\tReplace it in your Extended class");
            }
        }
    }
    /*
    This is called after last fetch in stack is done.
    This is how you can continue your node program, making it wait until all the promises are fulfilled
    before it continues to your next function
    */
    _postPromiseAll () {
        if (this.debugOn) {
            console.warn(this.#colorString("warn"), "* _postPromiseAll() is called after all promises are returned.");
            console.warn(this.#colorString("warn"), "\tReplace it in your Extended class, to keep processing alive in Node JS");
        }
        this.consoleLogPromiseList();
    }
}
exports.FetchSiteJsonStack = FetchSiteJsonStack;
