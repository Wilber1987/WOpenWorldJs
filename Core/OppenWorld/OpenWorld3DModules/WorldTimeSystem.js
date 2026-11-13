
/**
 * Sistema de tiempo del mundo.
 * 24 minutos reales equivalen a 24 horas de juego.
 */
export class WorldTimeSystem {
    constructor(options = {}) {
        this.hour = options.initialHour ?? 8;
        this.day = options.day ?? 1;

        // 1 hora de juego por cada minuto real.
        this.gameHoursPerRealSecond =
            options.gameHoursPerRealSecond ?? 1 / 60;

        this.enabled = options.enabled ?? true;

        this.onTimeChange = options.onTimeChange ?? null;
    }

    update(deltaSeconds) {
        if (!this.enabled || deltaSeconds <= 0) return;

        this._addHours(
            deltaSeconds * this.gameHoursPerRealSecond
        );
    }

    advanceTime(hours) {
        if (!Number.isFinite(hours) || hours <= 0) return;

        this._addHours(hours);
    }

    _addHours(hours) {
        const previousDay = this.day;

        const total = this.hour + hours;
        const daysPassed = Math.floor(total / 24);

        this.hour = total % 24;
        this.day += daysPassed;

        this._notify(previousDay !== this.day);
    }

    setTime(hour, day = this.day) {
        this.hour = ((hour % 24) + 24) % 24;
        this.day = Math.max(1, Math.floor(day));

        this._notify(true);
    }

    getTime() {
        const hours = Math.floor(this.hour);
        const minutes = Math.floor(
            (this.hour - hours) * 60
        );

        return {
            hour: this.hour,
            hours,
            minutes,
            day: this.day,
            formatted:
                `${String(hours).padStart(2, "0")}:` +
                `${String(minutes).padStart(2, "0")}`
        };
    }

    /**
     * Devuelve intensidad de luz diurna entre 0 y 1.
     * Amanecer: 06:00-07:30
     * Anochecer: 17:30-19:00
     */
    getDaylight() {
        const smoothstep = (a, b, x) => {
            const t = Math.max(
                0,
                Math.min(1, (x - a) / (b - a))
            );

            return t * t * (3 - 2 * t);
        };

        const sunrise = smoothstep(5.5, 7.5, this.hour);
        const sunset = 1 - smoothstep(17.5, 19, this.hour);

        return Math.min(sunrise, sunset);
    }

    getNightFactor() {
        return 1 - this.getDaylight();
    }

    _notify(dayChanged = false) {
        this.onTimeChange?.({
            ...this.getTime(),
            daylight: this.getDaylight(),
            nightFactor: this.getNightFactor(),
            dayChanged
        });
    }
}
