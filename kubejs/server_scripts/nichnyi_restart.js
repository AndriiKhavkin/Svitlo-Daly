// Нічний перезапуск виділеного сервера о 05:00 (за годинником серверного ноута).
// Скрипт 2_zapusk.bat після зупинки робить бекап, тягне оновлення з GitHub і запускає сервер знову.
const SD_RESTART_HOUR = 5
let sdRestartDone = -1
let sdWarned = {}
ServerEvents.tick(event => {
  const server = event.server
  if (server.getTickCount() % 200 != 0) return
  if (!server.isDedicatedServer()) return
  const now = new Date()
  const day = now.getDate(), h = now.getHours(), m = now.getMinutes()
  const C = Java.loadClass('net.minecraft.network.chat.Component')
  const warn = (key, text) => { if (sdWarned[key] != day) { sdWarned[key] = day; server.tell(C.literal(text)) } }
  if (h == SD_RESTART_HOUR - 1 && m >= 50 && m < 55) warn('10', '§e⚠ Нічне оновлення сервера через 10 хв (о 0' + SD_RESTART_HOUR + ':00).')
  if (h == SD_RESTART_HOUR - 1 && m >= 55 && m < 59) warn('5', '§e⚠ Нічне оновлення сервера через 5 хв. Зайдіть у безпечне місце.')
  if (h == SD_RESTART_HOUR - 1 && m == 59) warn('1', '§c⚠ Перезапуск за хвилину! Повернетесь за 2–3 хв.')
  if (h == SD_RESTART_HOUR && m < 5 && sdRestartDone != day && server.getTickCount() > 12000) {  // не раніше 10 хв після старту
    sdRestartDone = day
    server.tell(C.literal('§c✔ Зберігаю світ і перезапускаю сервер для оновлення…'))
    server.runCommandSilent('save-all')
    server.runCommandSilent('stop')
  }
})
