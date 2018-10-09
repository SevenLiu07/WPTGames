/*公共提示框*/
var newNotice = avalon.define("newNotice", function (vm) {
    vm.publicMsg = "";
    vm.$newNotice = {
        title: "title_notice",
        showClose: true,
        width: "747px",
        smallDialog: true,
        onOpen: function (data) {
            newNotice.publicMsg = data.publicMsg;
        },
        onConfirm: function () {
        },
        onClose: function () {

        }
    }
});
