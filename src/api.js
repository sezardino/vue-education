class RestApi {
    constructor() {
        this.apiKey = "";
        this.baseUrl = "https://min-api.cryptocompare.com/data/";
    }

    RESPONSE_ANSWER = {
        SUCCESS: "Success",
        ERROR: "Error",
    };

    _transformCoinList(list) {
        const keys = Object.keys(list);
        const formattedKeys = keys.map((item) => item.toLowerCase());
        return formattedKeys;
    }

    _checkResponse(response) {
        if ((response.Response = this.RESPONSE_ANSWER.SUCCESS)) {
            return response;
        } else if ((response.Response = this.RESPONSE_ANSWER.ERROR)) {
            console.log(response.Error);
        }
    }

    async getData(endpoint) {
        const response = await fetch(`${this.baseUrl}${endpoint}`);

        if (response.ok) {
            return await response.json();
        } else {
            console.log(response.statusText);
        }
    }

    async getCoinList(onSuccess, onError) {
        const response = await this.getData(`all/coinlist?summary=true`);
        if (this._checkResponse(response)) {
            onSuccess();
            return this._transformCoinList(response.Data);
        } else {
            onError();
        }
    }

    async subscribeOnCoin(coinName) {
        const response = await this.getData(`price?fsym=${coinName}&tsyms=USD`);
        const result = this._checkResponse(response);
        return result.USD;
    }
}

const api = new RestApi();

export { api };
