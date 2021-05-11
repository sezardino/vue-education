class WebSocketApi {
    constructor() {
        this.key =
            "28c43810589d1b0934d9b9f8cac237e4684e2548a4fa347c069febacdea69e4a";
        this.baseUrl = "wss://streamer.cryptocompare.com/v2";
        this.socket = new WebSocket(`${this.baseUrl}?api_key=${this.key}`);
        this.tickersHandlers = new Map();

        this.init();
    }

    AGGREGATE_INDEX = "5";

    sendMessageToWB(tickerName) {
        const sendMessage = JSON.stringify(this.subscribeMessage(tickerName));
        if (this.socket.readyState === this.socket.OPEN) {
            this.socket.send(sendMessage);
            return;
        }

        this.socket.addEventListener(
            "open",
            () => {
                this.socket.send(sendMessage);
            },
            { once: true }
        );
    }

    subscribeMessage(tickerName) {
        return {
            action: "SubAdd",
            subs: [`5~CCCAGG~${tickerName.toUpperCase()}~USD`],
        };
    }

    unsubscribeMessage(tickerName) {
        return {
            action: "SubRemove",
            subs: [`5~CCCAGG~${tickerName.toUpperCase()}~USD`],
        };
    }

    subscribeOnChanges(value, callback) {
        const subscribers = this.tickersHandlers.get(value) || [];
        this.tickersHandlers.set(value.toLowerCase(), [
            ...subscribers,
            callback,
        ]);
        this.sendMessageToWB(value);
    }

    unsubscribeOnChanges(value) {
        this.tickersHandlers.delete(value);
    }

    init() {
        this.socket.addEventListener("message", (message) => {
            const parsedMessage = JSON.parse(message.data);
            const {
                TYPE: type,
                FROMSYMBOL: currency,
                PRICE: newPrice,
            } = parsedMessage;
            if (type !== this.AGGREGATE_INDEX) {
                return;
            }
            // console.log(parsedMessage);
            const subscribers =
                this.tickersHandlers.get(currency.toLowerCase()) || [];
            console.log(currency, subscribers);
            subscribers.forEach((item) => item(newPrice));
        });
    }
}

// class RestApi {
//     constructor() {
//         this.apiKey = "";
//         this.baseUrl = "https://min-api.cryptocompare.com/data/";
//         this.tikersHandlers = new Map();

//         this.init();
//     }

//     RESPONSE_ANSWER = {
//         SUCCESS: "Success",
//         ERROR: "Error",
//     };

//     _transformCoinList(list) {
//         const keys = Object.keys(list);
//         const formattedKeys = keys.map((item) => item.toLowerCase());
//         return formattedKeys;
//     }

//     _checkResponse(response) {
//         if ((response.Response = this.RESPONSE_ANSWER.SUCCESS)) {
//             return response;
//         } else if ((response.Response = this.RESPONSE_ANSWER.ERROR)) {
//             console.log(response.Error);
//         }
//     }

//     async getData(endpoint) {
//         const response = await fetch(`${this.baseUrl}${endpoint}`);

//         if (response.ok) {
//             return await response.json();
//         } else {
//             console.log(response.statusText);
//         }
//     }

//     async getCoinList(onSuccess, onError) {
//         const response = await this.getData(`all/coinlist?summary=true`);
//         if (this._checkResponse(response)) {
//             onSuccess();
//             return this._transformCoinList(response.Data);
//         } else {
//             onError();
//         }
//     }

//     async getCurrencyData() {
//         if (this.tikersHandlers.size === 0) {
//             return;
//         }

//         const response = await this.getData(
//             `pricemulti?fsyms=${[...this.tikersHandlers.keys()]
//                 .map((item) => item.toUpperCase())
//                 .join()}&tsyms=USD`
//         );
//         const result = this._checkResponse(response);

//         const updatedPrice = Object.fromEntries(
//             Object.entries(result).map(([key, value]) => [
//                 key.toLowerCase(),
//                 value.USD,
//             ])
//         );

//         Object.entries(updatedPrice).forEach(([currency, newPrice]) => {
//             const handlers = this.tikersHandlers.get(currency) ?? [];
//             handlers.forEach((callback) => callback(newPrice));
//         });
//     }

//     subscribeOnChanges(value, callback) {
//         const subscribers = this.tikersHandlers.get(value) || [];
//         this.tikersHandlers.set(value, [...subscribers, callback]);
//     }

//     unsubscribeOnChanges(value) {
//         this.tikersHandlers.delete(value);
//     }

//     // init() {
//     //     setInterval(() => this.getCurrencyData(), 5000);
//     // }
// }

// new RestApi();
const api = new WebSocketApi();

window.tikers = api.tikersHandlers;

export { api };
