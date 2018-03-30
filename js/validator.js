/**
 * Created by niuzz on 2017/3/31.
 */
/*************************************************
 Validator v1.05
 code by 我佛山人
 wfsr@msn.com
 *************************************************/
Validator = {
    Require : /\S+/,
    Email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    Phone : /^(((\(\d{2,3}\))|(\d{3}\-))|(\(0\d{2,3}\)|0\d{2,3}-)){1}[1-9]\d{6,7}(\-\d{1,4})?$/,
    Mobile : /^1[3|4|5|7|8]\d{9}$/,
    PhoneAndMobile :/(^(((\(\d{2,3}\))|(\d{3}\-))|(\(0\d{2,3}\)|0\d{2,3}-){1})[1-9]\d{6,7}(\-\d{1,4})?$)|(^(((\(\d{2,3}\))|(\d{3}\-))?13\d{9}|15\d{9}|18\d{9})$)/,
    Url : /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
    IdCard : "this.IsIdCard(value)",
    Currency : /^\d+(\.\d+)?$/,
    Number : /^\d+$/,
    Zip : /^[0-9]\d{5}$/,
    QQ : /^[1-9]\d{4,8}$/,
    Integer : /^[-\+]?\d+$/,
    Double : /^[-\+]?\d+(\.\d+)?$/,
    English : /^[A-Za-z]+$/,
    Chinese : /^[\u0391-\uFFE5]+$/,
    Username : /^[a-z]\w{3,}$/i,
    UnSafe : /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
    IsSafe : function(str){return !this.UnSafe.test(str);},
    SafeString : "this.IsSafe(value)",
    Filter : "this.DoFilter(value, getAttribute('accept'))",
    Limit : "this.limit(value.length,getAttribute('min'), getAttribute('max'))",
    LimitB : "this.limit(this.LenB(value), getAttribute('min'), getAttribute('max'))",
    Date : "this.IsDate(value, getAttribute('min'), getAttribute('format'))",
    Repeat : "value == document.getElementsByName(getAttribute('to'))[0].value",
    Range : "getAttribute('min') < (value|0) && (value|0) < getAttribute('max')",
    Compare : "this.compare(value,getAttribute('operator'),getAttribute('to'))",
    Custom : "this.Exec(value, getAttribute('regexp'))",
    Group : "this.MustChecked(getAttribute('name'), getAttribute('min'), getAttribute('max'))",
    ErrorItem : [document.forms[0]],
    ErrorMessage : ["以下原因导致提交失败：\t\t\t\t"],
    myErrorMessage : [],
    toFocus:function(_validator_form,fieldName){
        var forms = document.forms;
        var form;
        for(var i = 0 ;i < forms.length;i++){
            if(forms[i]._validator_form == _validator_form){
                form = forms[i];
                break;
            }
        }
        var field = form[fieldName];
        var _f;
        if(field.length){
            _f = form[fieldName][0];
        }else{
            _f = form[fieldName];
        }

        if(_f.type == 'hidden'){
            if(_f.toFocusId){
                document.getElementById(_f.toFocusId).focus();
            }
        }else{
            _f.focus();
        }
    },
    Validate : function(theForm, mode){
        var obj = theForm || event.srcElement;
        obj._validator_form = Math.random();
        var count = obj.elements.length;
        this.ErrorMessage.length = 1;
        this.ErrorItem.length = 1;
        this.ErrorItem[0] = obj;
        for(var i=0;i<count;i++){
            with(obj.elements[i]){
                var _dataType = getAttribute("dataType");
                if(typeof(_dataType) == "object" || typeof(this[_dataType]) == "undefined") continue;
                this.ClearState(obj.elements[i]);
                value = value.replace(/^\s*/,"").replace(/\s*$/,"");
                if(getAttribute("require") == "false" && value == "") continue;
                switch(_dataType){
                    case "IdCard" :
                    case "Date" :
                    case "Repeat" :
                    case "Range" :
                    case "Compare" :
                    case "Custom" :
                    case "Group" :
                    case "Limit" :
                    case "LimitB" :
                    case "SafeString" :
                    case "Filter" :
                        if(!eval(this[_dataType])) {
                            this.AddError(i, getAttribute("msg"));
                        }
                        break;
                    default :
                        if(!this[_dataType].test(value)){
                            this.AddError(i, getAttribute("msg"));
                        }
                        break;
                }
            }
        }
        if((this.ErrorMessage.length > 1) || (this.myErrorMessage.length > 0)){
            mode = mode || 1;
            var errCount = this.ErrorItem.length;
            switch (mode) {
                case 2 :
                    for (var i = 1; i < errCount; i++)
                        this.ErrorItem[i].style.color = "red";
                case 1 :
                    alert(this.ErrorMessage.join("\n"));
                    this.ErrorItem[1].focus();
                    break;
                case 3 :
                    for (var i = 1; i < errCount; i++) {
                        try {
                            var span = document.createElement("SPAN");
                            span.id = "__ErrorMessagePanel";
                            span.style.color = "red";
                            this.ErrorItem[i].parentNode.appendChild(span);
                            span.innerHTML = this.ErrorMessage[i].replace(/\d+:/, "*");
                        }
                        catch(e) {
                            alert(e.description);
                        }
                    }
                    this.ErrorItem[1].focus();
                    break;
                case 4 :
                    try {
                        Validator.errPannel = document.getElementById("__topmessage");
                        var first = false;
                        if (Validator.errPannel == null) {
                            Validator.errPannel = document.createElement("<div id='__topmessage' class='floatMessage'>");
                            Validator.errPannel.innerHTML = '<span style="float:left;padding:5px 0px 0 10px;"><font color="red">错误提示：</font></span>'
                                + '<span style="float:right;padding:5px 10px 0 0;"><a href="javascript:Validator.closeenetMengCms();">关闭</a></span>'
                                + '<div><ul id="errorItems"></ul></div>';
                            document.body.appendChild(Validator.errPannel);
                            //Validator.errPannel.style.left = (document.documentElement.scrollLeft + document.documentElement.clientWidth - Validator.errPannel.offsetWidth) + "px";
                            Validator.errPannel.style.right = "5%";
                            first = true;
                        }
                        var msg = "";
                        for (var i = 1; i < errCount; i++) {
                            msg += "<li onclick='Validator.toFocus(\"" + obj._validator_form + "\",\"" + this.ErrorItem[i].name + "\")'>" + this.ErrorMessage[i].replace(/\d+:/, "*") + "</li>";
                        }
                        if (this.myErrorMessage.length > 0) {
                            for (var j = 0; j < this.myErrorMessage.length; j++) {
                                msg += "<li style='width:300px'>" + this.myErrorMessage[j].replace(/\d+:/, "*") + "</li>";
                            }
                        }
                        this.myErrorMessage = [];
                        document.getElementById("errorItems").innerHTML = msg;
                        Validator.errPannel.style.display = "block";
                        if(first)
                            Validator._errPanelHeight = Validator.errPannel.offsetHeight * 2 + 22 * errCount;
                        else
                            Validator._errPanelHeight = Validator.errPannel.offsetHeight;
                        Validator._pannelInitHeight = 0;
                        Validator._showError();
                    } catch(e) {
                        alert(e.description);
                    }
                    break;
                case 5:
                    var errPannel = document.getElementById("__topmessage");
                    if (!errPannel)
                        errPannel = document.createElement("<div id='__topmessage' class='floatMessage' style='width:300px'>");
                    //alert(this.myErrorMessage.length);
                    //errPannel.innerHTML = "";
                    var msg = "";
                    if (this.ErrorMessage.length > 1) {
                        for (var i = 1; i < errCount; i++) {
                            msg += "<li style='width:300px' onclick='Validator.toFocus(\"" + obj._validator_form + "\",\"" + this.ErrorItem[i].name + "\")'>" + this.ErrorMessage[i].replace(/\d+:/, "*") + "</li>";
                        }
                    }

                    if (this.myErrorMessage.length > 0) {
                        for (var j = 0; j < this.myErrorMessage.length; j++) {
                            msg += "<li style='width:300px'>" + this.myErrorMessage[j].replace(/\d+:/, "*") + "</li>";
                        }
                    }
                    alert(msg);
                    errPannel.innerHTML = msg;
                    this.myErrorMessage = [];
                    document.body.insertAdjacentElement("afterBegin", errPannel);
                    break;
                default :
                    alert(this.ErrorMessage.join("\n"));
                    break;
            }
            return false;
        }
        return true;
    },
    limit : function(len,min, max){
        min = min || 0;
        max = max || Number.MAX_VALUE;
        return min <= len && len <= max;
    },
    LenB : function(str){
        return str.replace(/[^\x00-\xff]/g,"**").length;
    },
    ClearState : function(elem){
        with(elem){
            if(style.color == "red")
                style.color = "";
            var lastNode = parentNode.childNodes[parentNode.childNodes.length-1];
            if(lastNode.id == "__ErrorMessagePanel")
                parentNode.removeChild(lastNode);
        }
    },
    AddError : function(index, str){
        this.ErrorItem[this.ErrorItem.length] = this.ErrorItem[0].elements[index];
        this.ErrorMessage[this.ErrorMessage.length] = this.ErrorMessage.length + ":" + str;
    },
    myAddError : function(str) {
        this.myErrorMessage[this.myErrorMessage.length] = this.myErrorMessage.length + ":" + str;
    },
    Exec : function(op, reg){
        return new RegExp(reg,"g").test(op);
    },
    compare : function(op1,operator,op2){
        switch (operator) {
            case "NotEqual":
                return (op1 != op2);
            case "GreaterThan":
                return (op1 > op2);
            case "GreaterThanEqual":
                return (op1 >= op2);
            case "LessThan":
                return (op1 < op2);
            case "LessThanEqual":
                return (op1 <= op2);
            default:
                return (op1 == op2);
        }
    },
    MustChecked : function(name, min, max){
        var groups = document.getElementsByName(name);
        var hasChecked = 0;
        min = min || 1;
        max = max || groups.length;
        for(var i=groups.length-1;i>=0;i--)
            if(groups[i].checked) hasChecked++;
        return min <= hasChecked && hasChecked <= max;
    },
    DoFilter : function(input, filter){
        return new RegExp("^.+\.(?=EXT)(EXT)$".replace(/EXT/g, filter.split(/\s*,\s*/).join("|")), "gi").test(input);
    },
    IsIdCard : function(number){
        var date, Ai;
        var verify = "10x98765432";
        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var area = ['','','','','','','','','','','','北京','天津','河北','山西','内蒙古','','','','','','辽宁','吉林','黑龙江','','','','','','','','上海','江苏','浙江','安微','福建','江西','山东','','','','河南','湖北','湖南','广东','广西','海南','','','','重庆','四川','贵州','云南','西藏','','','','','','','陕西','甘肃','青海','宁夏','新疆','','','','','','台湾','','','','','','','','','','香港','澳门','','','','','','','','','国外'];
        var re = number.match(/^(\d{2})\d{4}(((\d{2})(\d{2})(\d{2})(\d{3}))|((\d{4})(\d{2})(\d{2})(\d{3}[x\d])))$/i);
        if(re == null) return false;
        if(re[1] >= area.length || area[re[1]] == "") return false;
        if(re[2].length == 12){
            Ai = number.substr(0, 17);
            date = [re[9], re[10], re[11]].join("-");
        }
        else{
            Ai = number.substr(0, 6) + "19" + number.substr(6);
            date = ["19" + re[4], re[5], re[6]].join("-");
        }
        if(!this.IsDate(date, "ymd")) return false;
        var sum = 0;
        for(var i = 0;i<=16;i++){
            sum += Ai.charAt(i) * Wi[i];
        }
        Ai += verify.charAt(sum%11);
        return (number.length ==15 || number.length == 18 && number == Ai);
    },
    IsDate : function(op, formatString){
        formatString = formatString || "ymd";
        var m, year, month, day;
        switch(formatString){
            case "ymd" :
                m = op.match(new RegExp("^((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})$"));
                if(m == null ) return false;
                day = m[6];
                month = m[5]*1;
                year = (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10));
                break;
            case "dmy" :
                m = op.match(new RegExp("^(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))$"));
                if(m == null ) return false;
                day = m[1];
                month = m[3]*1;
                year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(m[6], 10));
                break;
            default :
                break;
        }
        if(!parseInt(month)) return false;
        month = month==0 ?12:month;
        var date = new Date(year, month-1, day);
        return (typeof(date) == "object" && year == date.getFullYear() && month == (date.getMonth()+1) && day == date.getDate());
        function GetFullYear(y){return ((y<30 ? "20" : "19") + y)|0;}
    },
    errPannel:null,
    _errPanelHeight:0,
    _pannelInitHeight:0,
    _winScroll:function(){
        var wHeight = document.documentElement.scrollTop + document.documentElement.clientHeight;
        var wWidth = document.documentElement.scrollLeft + document.documentElement.clientWidth;
        Validator.errPannel.style.top=(wHeight -Validator.errPannel.offsetHeight)+"px";
        //Validator.errPannel.style.left=(wWidth - Validator.errPannel.offsetWidth)+"px";
        Validator.errPannel.style.left = "5%";
    },
    _showError:function(){
        //alert("Validator._pannelInitHeight:" + Validator._pannelInitHeight +";Validator._errPanelHeight:"+Validator._errPanelHeight)
        if(Validator._pannelInitHeight < Validator._errPanelHeight){
            //Validator.errPannel.style.top = (document.documentElement.scrollTop + document.documentElement.clientHeight - Validator._pannelInitHeight) + "px";
            Validator.errPannel.style.bottom = "0";
            //Validator.errPannel.style.height = Validator._pannelInitHeight + "px";
            //Validator.errPannel.style.left=( document.documentElement.scrollLeft + document.documentElement.clientWidth - Validator.errPannel.offsetWidth)+"px";
            Validator.errPannel.style.right = "0";
            //Validator._pannelInitHeight += 20;
            window.setTimeout(Validator._showError,1);
        }else{
            window.onscroll = Validator._winScroll;
        }
    }
    ,
    closeenetMengCms:function(){
        Validator.errPannel.style.display = "none";
    }
}