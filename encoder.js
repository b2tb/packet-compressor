
function Encode(){
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
    const __default_allocation = 1028;
    this.__buffer = new ArrayBuffer(__default_allocation);
    this.idx = 0;
    this.buffer = new Uint8Array(this.__buffer);
    this.encode = function(object){
        this.run_encode(object);
        let view = new Uint8Array(this.__buffer, 0, this.idx).slice();
        return this.idx=0, view;
    }
    this.run_encode = function(object){
        if(Array.isArray(object)){
            this.encode_array(object);
        }else if(typeof(object) === "number"){
            this.encode_number(object)
        }else if(typeof(object) === "string"){
            this.encode_string(object);
        }
    }
    this.encode_string = function(str){
        this.buffer[this.idx++] = HEADERS.STRING;
        this.buffer[this.idx++] = str.length;
        for(let i = 0 ; i < Math.min(0xff, str.length); i++) this.buffer[this.idx++] = str[i].charCodeAt(0);
    }
    this.encode_number = function(number){
        if(number < 0 && number >= -128) return this.write_i8(number);
        if(number < -128 && number >= -32768) return this.write_i16(number);
        if(number >= 0 && number <= 0xff) return this.write_u8(number);
        if(number > 0xff && number <= 0xffff) return this.write_u16(number);
    }
    this.encode_array = function(array){
        this.buffer[this.idx++] = HEADERS.ARRAY;
        this.buffer[this.idx++] = array.length;
        for(let i = 0 ; i < array.length; i++) this.run_encode(array[i]); 
    }
    this.write_u8 = function(u8){
        this.buffer[this.idx++] = HEADERS.U8;
        this.buffer[this.idx++] = u8;
    }
    this.write_i8 = function(i8){
        this.buffer[this.idx++] = HEADERS.I8;
        this.buffer[this.idx++] = i8;
    }
    this.write_u16 = function(u16){
        this.buffer[this.idx++] = HEADERS.U16;
        this.buffer[this.idx++] = (u16 >> 8) & 0xff;
        this.buffer[this.idx++] = (u16 | 0) & 0xff;
    }
    this.write_i16 = function(i16){
        this.buffer[this.idx++] = HEADERS.I16;
        this.buffer[this.idx++] = (i16 >> 8) & 0xff;
        this.buffer[this.idx++] = (i16 | 0) & 0xff;
    }
}
