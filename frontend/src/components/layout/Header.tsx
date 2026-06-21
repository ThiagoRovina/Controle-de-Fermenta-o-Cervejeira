import logoArbrain from '../../images/logo-arbrain-dark.png'

export default function Header() {
  return (
    <header className="flex h-[72px] w-full items-center justify-between bg-brand-dark px-6 text-white">
      <div className="flex items-center gap-3">
        <img className="h-12 w-12 rounded-md object-cover" src={logoArbrain} alt="FermentaTrack" />
        <div className="text-[15px] font-semibold leading-none">
          Fermenta<span className="text-brand-yellow">Track</span>
        </div>
      </div>
    </header>
  )
}
