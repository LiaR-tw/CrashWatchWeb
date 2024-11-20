class Stat {
  private _title: string;
  private _value: string;
  private _color: string;
  private _icon: string;

  constructor(title: string, value: string, color: string, icon: string) {
    this._title = title;
    this._value = value;
    this._color = color;
    this._icon = icon;
  }

  // Getters
  get title(): string {
    return this._title;
  }

  get value(): string {
    return this._value;
  }

  get color(): string {
    return this._color;
  }

  get icon(): string {
    return this._icon;
  }

  // Setters
  set title(newTitle: string) {
    this._title = newTitle;
  }

  set value(newValue: string) {
    this._value = newValue;
  }

  set color(newColor: string) {
    this._color = newColor;
  }

  set icon(newIcon: string) {
    this._icon = newIcon;
  }
}

// Crear las instancias de Stat con iconos
const stats: Stat[] = [
  new Stat("Accidents Attended", "5,423", "bg-green-100 text-green-700", "icon-accidents"),
  new Stat("New Accidents", "8", "bg-red-100 text-red-700", "icon-new"),
  new Stat("People Connected", "189", "bg-blue-100 text-blue-700", "icon-people"),
];

// Componente con iconos y nuevos atributos
const StatsCards: React.FC = () => (
  <div className="grid grid-cols-3 gap-6 px-8 py-6">
    {stats.map((stat, index) => (
      <div key={index} className={`p-6 rounded-lg ${stat.color} shadow`}>
        <div className="flex items-center space-x-4">
          <i className={`text-2xl ${stat.icon}`}></i> {/* Icono agregado */}
          <h3 className="text-lg font-semibold">{stat.title}</h3>
        </div>
        <p className="text-2xl font-bold mt-4">{stat.value}</p>
      </div>
    ))}
  </div>
);

export default StatsCards;
