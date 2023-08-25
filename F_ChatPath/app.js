$(document).ready(() => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7268/chatpath")
        .build();

    connection.start();

    $(".disabled").attr("disabled", "disabled");

    $("body").on("click", ".users", function () {
        $(".users").each((index, item) => {
            item.classList.remove("active");
        });
        $(this).addClass("active");
    });

    $("#btnGirisYap").click(() => {
        const nickName = $("#txtNickName").val();
        const sanitizedNickName = $("<div>").text(nickName).html();
        connection.invoke("GetNickName", sanitizedNickName).catch(error => console.log(error, "btnGirisYapta problem var"));
        $(".disabled").removeAttr("disabled");
        document.getElementById("txtNickName").value = "";
    });

    connection.on("clientJoined", nickName => {
        const sanitizedNickName = $("<div>").text(nickName).html();
        $("#clientDurumMesajlari").html(`${sanitizedNickName} giriş yaptı.`);
        $("#clientDurumMesajlari").fadeIn(2000, () => {
            setTimeout(() => {
                $("#clientDurumMesajlari").fadeOut(2000);
            }, 2000);
        });
    });

    connection.on("clients", clients => {
        $("#_clients").html("");
        $.each(clients, (index, item) => {
            const user = $(".users").first().clone();
            user.removeClass("active");
            user.html(item.nickName);
            $("#_clients").append(user);
        })
    });

    connection.on("receiveMessage", (message, nickName) => {
        const _message = $(".message").clone();
        _message.removeClass("message");
        _message.find("p").html(message);
        _message.find("h5")[0].innerHTML = nickName;
        $(".messages").append(_message);
    });

    $("#btnGonder").click(() => {
        const clientName = $(".users.active").first().html(); 
        const message = $("#txtMesaj").val();
        connection.invoke("SendMessageAsync", message, clientName);
        const _message = $(".message").clone();
        _message.removeClass("message");
        _message.find("p").html(message);
        _message.find("h5")[1].innerHTML = "Sen";
        $(".messages").append(_message);
    });

    let _groupName = "";
    $("#btnKanalaGonder").click(() => {
        const message = $("#txtMesaj").val();
        if(_groupName != ""){
            connection.invoke("SendMessageToGroupAsync", _groupName, message);
            const _message = $(".message").clone();
            _message.removeClass("message");
            _message.find("p").html(message);
            _message.find("h5")[1].innerHTML = "Sen";
            $(".messages").append(_message);
        }
    });

    $("#btnKanalOlustur").click(() => {
        connection.invoke("AddGroup", $("#txtKanalAdi").val());
    });

    connection.on("groups", groups => {
        $(".rooms").html("");
        let options = `<option selected value="-1">Kanallar</option>`;
        $.each(groups, (index, item) => {
            options += `<option value="${item.groupName}">${item.groupName}</option>`;
        });
        $(".rooms").append(options);
    });

    $("#btnKanallaraGir").click(() => {
        let groupNames = [];
        $(".rooms option:selected").map((i, e) => {
            groupNames.push(e.innerHTML);
        });
        connection.invoke("AddClientToGroup", groupNames);
    });

    $(".rooms").change(function () {
        let groupName = $(this).val();
        _groupName = groupName[0];
        connection.invoke("GetClientToGroup", groupName[0]);
    });
})
