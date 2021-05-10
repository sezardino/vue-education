class RestApi {
    constructor() {
        this.apiKey = "";
        this.baseUrl = "https://min-api.cryptocompare.com/data/";
        this.tikersHandlers = new Map();

        this.init();
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

    async getCurrencyData() {
        if (this.tikersHandlers.size === 0) {
            return;
        }

        const response = await this.getData(
            `pricemulti?fsyms=${[...this.tikersHandlers.keys()]
                .map((item) => item.toUpperCase())
                .join()}&tsyms=USD`
        );
        const result = this._checkResponse(response);

        const updatedPrice = Object.fromEntries(
            Object.entries(result).map(([key, value]) => [
                key.toLowerCase(),
                value.USD,
            ])
        );
        console.log(updatedPrice);
        Object.entries(updatedPrice).forEach(([currency, newPrice]) => {
            const handlers = this.tikersHandlers.get(currency) ?? [];
            handlers.forEach((callback) => callback(newPrice));
        });
    }

    subscribeOnChanges(value, callback) {
        const subscribers = this.tikersHandlers.get(value) || [];
        this.tikersHandlers.set(value, [...subscribers, callback]);
    }

    unsubscribeOnChanges(value) {
        this.tikersHandlers.delete(value);
    }

    init() {
        setInterval(() => this.getCurrencyData(), 5000);
    }
}

const api = new RestApi();

window.tikers = api.tikersHandlers;

export { api };
