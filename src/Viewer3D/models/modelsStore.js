
class AbstractDataModel {
    constructor() {
        this.__elements = []; // Es un arreglo o un objeto?
    }

    get(element) {
        const data_obj = this.__elements[element];
        return data_obj && data_obj.data ? data_obj.data : undefined;
    }

    set(element, value) {
        const data_obj = {};
        data_obj.data = value;

        if (typeof value === 'undefined') {
            delete this.__elements[element];
        } else {
            this.__elements[element] = data_obj;
        }

        return this;
    }

    save(value) {
        const data_obj = {};
        data_obj.data = value;
        this.__elements.push(data_obj)
        return this;
    }

    has(element) {
        return this.__elements.hasOwnProperty(element);
    }

    hasByName(current) {
        for (const key in this.__elements) {
            const el = this.__elements[key].data;
            if (el.name === current) {
                return {el, key};
            }
        }
        return {};
    }

    unset(element) {
        if (this.has(element)) {
            delete this.__elements[element];
        }

        return this;
    }

    clear() {
        this.__elements = null;
        this.__elements = {};

        return this;
    }
}

export default AbstractDataModel;