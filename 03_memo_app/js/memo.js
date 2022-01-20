"use strict";
window.addEventListener("DOMContentLoaded",
    function(){

    //1.localStorageが使えるか確認
    if (typeof localStorage === "undefined"){
        window.alert("このブラウザはLocalStorage機能が実装されていません");
        return;
        }else{
            viewStorage(); //LocalStorageからのデータ取得とテーブルへ表示
            saveLocalStorage();  // 2.localStorageへの保存
            delLocalStorage(); // 3.LocalStorage から一つ削除
            allClearLocalStorage();//4.localStorageから全て削除
            selectTable(); // 5.データ選択
        }

    }, false
);


//2.localStorageへの保存
function saveLocalStorage() {
    const save = document.getElementById("save");
    save.addEventListener("click",
        function(e){
            e.preventDefault();
            const key = document.getElementById("textKey").value;
            const value = document.getElementById("textMemo").value;

            //値の入力チェック
            if (key=="" || value==""){
                window.alert("Key、Memoはいずれも必須です。");
                return;
            } else {
                let w_confirm = confirm("LocalStorageに\n「" + key + " " + value + "」\nの内容を保存しますか？");
                //確認ダイアログで「OK」を押されたとき保存するversion-up1 add

                if (w_confirm === true){//version-up1 add
                    localStorage.setItem(key, value);
                    viewStorage();  //LocalStorageからのデータ取得とテーブルへ表示
                    let w_msg = "LocalStorageに" + key + " " + value + "を保存しました";
                    window.alert(w_msg);
                    document.getElementById("textKey").value = "";
                    document.getElementById("textMemo").value = "";
                }//version-up1 add
            }

        },false
    );
};

// 3.LocalStorage から選択されている行を削除  //version-up3 add 一件削除 ==> 選択されている行を削除
function delLocalStorage() {
    const del = document.getElementById("del");
    del.addEventListener("click",
        function(e){
            e.preventDefault();
            const chkbox1 = document.getElementsByName("chkbox1");  //version-up3 add
            const table1 = document.getElementById("table1");       //version-up3 add
            let w_cnt = 0; //選択されているチェックボックスの数が返却される//version-up3 w_sel="0" ==> w_cnt
            w_cnt = selectCheckBox("del"); //テーブルからデータ選択//version-up3 chnge 戻り値：w_sel ==> w_cnt 引数：なし ==>del

            if (w_cnt >= 1){        //version-up3 change w_sel==="1" ==> w_cnt >=1
                let w_confirm = confirm("LocalStorageから選択されている"+ w_cnt +"件を削除しますか？"); //version-up3 chg
                //確認ダイアログで「OK」を押されたとき保存するversion-up1 add

                if (w_confirm === true){//version-up1 add
                    for(let i = 0;i < chkbox1.length;i ++ ) { //version-up add
                        if(chkbox1[i].checked) {  //version-up3 add
                            localStorage.removeItem(table1.rows[i+1].cells[1].firstChild.data);  //version-up add
                        }       //version-up3 add
                    }       //version-up3 add
                    viewStorage();  //LocalStorageからのデータ取得とテーブルへ表示
                    let w_msg = "LocalStorageから" + w_cnt + "件を削除しました";      //version-up3 chg
                    window.alert(w_msg);
                    document.getElementById("textKey").value = "";
                    document.getElementById("textMemo").value = "";
                }//version-up1 add
            }

        },false
    );
};

//4.localStorageから全て削除
function allClearLocalStorage() {
    const allClear = document.getElementById("allClear");
    allClear.addEventListener("click",
        function(e){
            e.preventDefault();
            let w_confirm = confirm("LocalStorageのデータを全て削除します。\nよろしいですか？");
            //確認ダイアログで「OK」を押されたとき、全て削除する。

            if (w_confirm === true){
                localStorage.clear();
                viewStorage(); //localStorageからのデータ取得とテーブルへ表示
                let w_msg = "LocalStorageのデータを全て削除しました";
                window.alert(w_msg);
                document.getElementById("textKey").value = "";
                document.getElementById("textMemo").value = "";
            }

        },false
    );
};

//5.データ選択
function selectTable() {
    const select = document.getElementById("select");
    select.addEventListener("click",
        function(e) {
            e.preventDefault();
            selectCheckBox("select"); //テーブルからデータを選択 //version-up3 change 引数：なし==>"select"
        }, false
    );
};

//テーブルからデータを選択
function selectCheckBox(mode) {     //version-up3 change 引数：なし==> mode
    let w_cnt =0; //選択されチェックボックスの数 //version-up2
    const chkbox1 = document.getElementsByName("chkbox1");
    const table1 = document.getElementById("table1");
    let w_textKey = ""; //work version-up2 add
    let w_textMemo = ""; //work version-up2 add

    for(let i=0; i < chkbox1.length; i++) {
        if(chkbox1[i].checked) { //最初にチェックされている行をワークに退避 version-up2 add
            if(w_cnt === 0){
                w_textKey = table1.rows[i+1].cells[1].firstChild.data;
                w_textMemo = table1.rows[i+1].cells[2].firstChild.data;
            }
            w_cnt++;
        }                               //version-up2 add
    }

    document.getElementById("textKey").value = w_textKey;    //version-up2 add
    document.getElementById("textMemo").value = w_textMemo;  //version-up2 add

    if(mode === "select"){                //version-up3 add
        if(w_cnt === 1){                //version-up2 add
            return w_cnt;               //version-up3 add
        }else{                          //version-up2 add
            window.alert("1つ選択してください！");
        }
    }

    if(mode === "del") {
        if (w_cnt >= 1) {
          return w_cnt;   ////version-up chg  w_sel = "1" ==> w_cnt
        } 
        else {
            window.alert("1つ選択してください！");
        }
    }                                  //version-up3 add
};



//LocalStorageからのデータ取得とテーブルへ表示
function viewStorage(){
    const list = document.getElementById("list");
    // htmlのテーブル初期化
    while(list.rows[0]) list.deleteRow(0);

    for(let i=0; i <localStorage.length; i++) {
        let w_key = localStorage.key(i);
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");

        list.appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        td1.innerHTML = "<input name = 'chkbox1' type = 'checkbox'>";
        td2.innerHTML = w_key;
        td3.innerHTML = localStorage.getItem(w_key);
    }

    //jQuaryのplugin　tabalesortを使ってテーブルのノート
    //sortList: 引数1...最初からノートしておく列を指定、引数2...0...昇順
    $("#table1").tablesorter({      //tablesort add
        sortList:[[1,0]]            //tablesort add
    });                             //tablesort add

    $("#table1").trigger("update"); //tablesort add
}