import { TableMakerView } from "./TableMakerView.js";

export class TableMaker{
    constructor(){
        this.data = null;
        this.colorInfoReset = {
            border : "#333",
            th : "#eaeaea",
            td : "#fff",
            color : "#000"
        }
        this.colorInfo = {...this.colorInfoReset};
    }//constructor
    /* BUILDER */
    /**
     * 
     * @param {*} data 
     * @returns 
     */
    set_data(data){
        this.data = data;
        return this;
    }//set_data

    /**
     * 
     * @param {*} colorInfo 
     */
    set_color_info(colorInfo = {}){
        this.colorInfo = {...colorInfo};
        return this;
    }//set_color_info

    init(){
        /* wrap */
        const {$wrap, $box} = TableMakerView.make_wrap();

        /* early return */
        if(!this.data){return $wrap;}

        /* 테이블 */
        const $table = TableMakerView.make_table(this.data);
        $box.appendChild($table);

        /* 테이블에 색상정보 입력 */
        for(const key in this.colorInfo){
            const value = this.colorInfo[key] || this.colorInfoReset[key];
            $box.style.setProperty(`--_${key}`, value);
        }//for:colorInfo

        /* 좌우 스크롤 가능하다는 안내 */
        const $scrollStr = TableMakerView.scrollStr();
        $wrap.appendChild($scrollStr);
        
        /* 최종 */
        return $wrap;
    }//init
}//class-TableMaker