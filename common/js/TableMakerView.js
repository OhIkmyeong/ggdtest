export class TableMakerView {
    constructor() {

    }//constructor

    /**
     * 
     * @returns 
     */
    static make_wrap() {
        const $wrap = document.createElement("DIV");
        $wrap.classList.add("sbz-tbl-wrap");

        const $box = document.createElement("SECTION");
        $box.classList.add("sbz-tbl-box");
        $wrap.appendChild($box)

        return { $wrap, $box };
    }//make_wrap

    /**
     * 
     * @returns 
     */
    static scrollStr() {
        const $str = document.createElement("P");
        $str.classList.add("sbz-tbl-scroll");
        $str.textContent = "좌,우 스크롤 가능";
        return $str;
    }//scrollStr

    /**
     * 
     * @param {*} data 
     */
    static make_table(data) {
        const { caption, showCaption, colgroup, thead, tbody } = data;

        /* 테이블 */
        const $tbl = document.createElement("TABLE");
        $tbl.classList.add("sbz-tbl");

        /* 캡션 */
        const $caption = TableMakerView.make_caption({ caption, showCaption });
        $tbl.appendChild($caption);

        /* colgroup */
        const $colgroup = TableMakerView.make_colgroup(colgroup);
        $tbl.appendChild($colgroup);

        /* thead */
        const $thead = TableMakerView.make_thead({ thead, colgroup });
        $tbl.appendChild($thead);

        /* tbody */
        const $tbody = TableMakerView.make_tbody({ tbody, colgroup });
        $tbl.appendChild($tbody);

        /* 최종 */
        return $tbl;
    }//make_table

    /**
     * 
     * @param {*} caption 
     */
    static make_caption({ caption, showCaption = false }) {
        const $caption = document.createElement("CAPTION");
        $caption.classList.add(showCaption ? "sbz-tbl-caption" : "hidden-readable");
        $caption.textContent = caption;
        return $caption;
    }//make_caption

    /**
     * 
     * @param {*} colgroup 
     * @returns 
     */
    static make_colgroup(colgroup){
        const $colgroup = document.createElement("COLGROUP");

        for(const col of colgroup){
            const {name, width} = col;
            const $col = document.createElement("COL");
            $col.style.width = width || "auto";
            $col.dataset.col = name; 
        }

        return $colgroup;
    }//make_colgroup

    /**
     * 
     * @param {*} thead 
    */
    static make_thead({ thead, colgroup }) {
        /* wrap */
        const $thead = document.createElement("THEAD");
        $thead.classList.add("sbz-tbl-thead");

        /* fill */
        thead.forEach((row) => {
            const $tr = document.createElement("TR");
            $thead.appendChild($tr);

            /* fill row */
            row.forEach((th) => {
                const { name, title, rowspan, colspan } = th;
                const $th = document.createElement("TH");
                if (rowspan) { $th.rowSpan = rowspan; }
                if (colspan) { $th.colSpan = colspan; }
                $th.classList.add("sbz-tbl-thead-th");
                $th.dataset.col = name;
                $th.textContent = title;
                const textAlign = colgroup?.find(col => col.name === name)?.textAlign;
                $th.style.textAlign = textAlign || "center";
                $tr.appendChild($th);
            });
        });

        /* 최종 */
        return $thead;
    }//make_thead

    /**
     * 
     * @param {*} param0 
     */
    static make_tbody({ tbody, colgroup }) {
        /* wrap */
        const $tbody = document.createElement("TBODY");

        /* remember : rowspan */
        const rowspanInfos = [];
        
        /* fill */
        tbody.forEach((bodyItem) => {
            const { rowspanInfo, colspanInfo } = bodyItem;
            if(rowspanInfo){rowspanInfos.push({...rowspanInfo});}
            
            /* remember : colspan */
            const colspanInfos = [];
            if(colspanInfo){colspanInfos.push({...colspanInfo});}

            /* tr */
            const $tr = document.createElement("TR");
            $tbody.appendChild($tr);

            /* fill tr */
            for(const col of colgroup){
                const {name,textAlign} = col;

                /* early return : rowspan */
                const rowspanRemainIdx = rowspanInfos.findIndex(item => item.name === name);
                if(!rowspanInfo && rowspanRemainIdx >= 0){
                    const rowspanRemain = rowspanInfos[rowspanRemainIdx]; 
                    rowspanRemain.count--;
                    if(rowspanRemain.count <= 1){
                        rowspanInfos.splice(rowspanRemainIdx,1);
                    }
                    continue;
                }

                /* early return : colspan */
                if(colspanInfos.length && !colspanInfo){
                    const last = colspanInfos.at(-1); 
                    last.count--;
                    if(last.count <= 1){
                        colspanInfos.pop();
                    }
                    continue;
                }

                /* td 생성 */
                const $td = document.createElement("TD");
                $td.classList.add("sbz-tbl-tbody-td");

                /* rowspan 설정 */
                if(rowspanInfo?.name === name){
                    $td.rowSpan = rowspanInfo.count;
                }
                /* colspan 설정 */
                if(colspanInfo?.name === name){
                    $td.colSpan = colspanInfo.count;
                }
                /* 텍스트 정렬 */
                $td.style.textAlign = textAlign || "center";

                /* fill td */
                const value = bodyItem?.[name];
                if(value === true){
                    $td.textContent = "○";
                }else{
                    $td.innerHTML = value ?? "-";
                }
                $tr.appendChild($td);
            }//for:colgroup

            /* discount rowspan */
        });

        /* 최종 */
        return $tbody;
    }//make_tbody
}//class-TableMakerView