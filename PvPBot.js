const Mineflyer = require("mineflayer");
var client = Mineflyer.createBot({
    username: process.argv[2],
    host: "0.tcp.ap.ngrok.io",
    port: 17737
})
var target, aim;
var attackrate = 1000;

function log(arg) {
    console.log(process.argv[2], arg)
}

client.on("disconnect", function (packer) {
    log("I:MCJE   :Socket :disConnected", packet.reason)
});

client.on("connect", function () {
    log("I:MCJE   :Socket :Connected");
    setTimeout(() => {
        client.chat("Hi!")

        isReady = true;
        log("ready")

    }, 5000);
})

client.on("chat", (user, message) => {
    if (user == client.username) return;
    if (message.slice(0, 2) != "P/") return;
    var args = message.split(" ")
    if (args[0] == "P/select") {
        target = client.players[args[1]];
        attackrate = parseInt(args[2]);
        if (!target) {
            client.chat("Player Not found");
            target = undefined;
        } else {
            client.chat("Selected for " + args[1] + " attackrate:" + attackrate);
        }
    }
})

function get_aim(target) {
    if (target == undefined) {
        return 0
    }
    var dx = target.x - client.entity.position.x;
    var dy = target.y - client.entity.position.y;
    var dz = target.z - client.entity.position.z;
    var p = 0, p = 0;

    y = Math.atan2(dx, dz) - Math.PI
    if (y > -45 * Math.PI / 180 && y <= 45 * Math.PI / 180) {
        p = Math.atan2(dz, dy);
    } else if (y > -135 * Math.PI / 180 && y <= -45 * Math.PI / 180) {
        p = Math.atan2(dx, dy)
    } else if (y > 45 * Math.PI / 180 && y <= 135 * Math.PI / 180) {
        p = -Math.atan2(dx, dy);
    } else {
        p = -Math.atan2(dz, dy);
    }
    p = p - Math.PI / 2;

    return {
        y: y,
        p: p,
        dx: dx,
        dy: dy,
        dz: dz,
    }
}



var timer = undefined;
var prevPosition = { x: 0, y: 0, z: 0 };
setInterval(() => {
    //process.stdout.write(`\r${(client||{}).health}\t\t`);
    if (!target) {
        return;
    }
    if (!target.entity) {
        target = undefined;
        client.setControlState("forward", false);
        client.chat("殺してごめんね！")
        return;
    }
    client.lookAt(target.entity.position.offset(0, 1.65, 0))
    client.setControlState("forward", true);

    var s = Attackableentity(target.entity);
    if (s && !timer) {
        timer = setInterval(() => {
            if (target) {
                if (target.entity) {
                    client.attack(target.entity)
                }
            }
        }, attackrate)
    }
    if (timer && !s) {
        clearInterval(timer)
        timer = undefined;
    }

}, 1);
setInterval(() => {
    if (!target) {
        //log("return by Notset entity")
        return;
    }
    var now = Object.assign({}, ptoo(client.entity.position));
    var prev = Object.assign({}, ptoo(prevPosition));
    var isWalked = check_position(prev, now);
    if (isWalked == false) {
        client.setControlState("jump", true);
        client.setControlState("jump", false);
    }
    prevPosition = now

}, 100);
function ptoo(position) {
    return {
        x: Number(position.x.toFixed(1)),
        y: Number(position.y.toFixed(1)),
        z: Number(position.z.toFixed(1)),
    }
}
function Attackableentity(target) {
    var a = client.entity.position.distanceTo(target.position)
    if (a < 2) return true;
    return undefined
}
function check_position(p1, p2) {
    a = p1.x;
    b = p1.y;
    c = p1.z;
    d = p2.x;
    e = p2.y;
    f = p2.z;
    return (a !== d) && (b !== e) && (c !== f)

}
