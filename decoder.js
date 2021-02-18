function Decode(){
    const HEADERS = {
        "ARRAY": 0,
        "STRING": 1,
        "I8": 2,
        "I16": 3,
        "I32": 4,
        "U8": 6,
        "U16": 7,
        "U32": 8,
    }
    this.idx = 0;
    this.buffer = null;
    this.decode = function(buffer){
        this.buffer = buffer;
        this.idx = 0;
        return this.decode_type();
    }
    
    this.decode_type = function(){
        const header = this.read_header();
        if(header === HEADERS.STRING) return this.decode_string();
        if(header === HEADERS.ARRAY) return this.decode_array();
        if(header === HEADERS.I8) return this.decode_i8();
        if(header === HEADERS.I16) return this.decode_i16();
        if(header === HEADERS.U8) return this.decode_u8();
        if(header === HEADERS.U16) return this.decode_u16();
    }

    this.decode_u8 = function(){
        return this.buffer[this.idx++];
    }

    this.decode_u16 = function(){
        return (this.buffer[this.idx++] << 8) | this.buffer[this.idx++];
    }

    this.decode_i8 = function(){
        return ((this.decode_u8() + 128) % 128)-128;
    }

    this.decode_i16 = function(){
        return (this.decode_u16() + 32768) % 65536 - 32768;
    }

    this.decode_array = function(){
        const length = this.read_header();
        const array = new Array(length);
        for(let i = 0 ; i < length; i++){array[i] = this.decode_type()};
        return array;
    }

    this.decode_char = function(){
        return this.buffer[this.idx++];
    }

    this.decode_string = function(){
        let str = "";
        for(let i = 0, length = this.read_header(); i < length; i++) str+=String.fromCharCode(this.decode_char());
        return str;
    }

    this.read_header = function(){return this.buffer[this.idx++]};

}
