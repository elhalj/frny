import { NavLink } from "react-router-dom";

interface SlideToProps {
  to: string;
  title?: string;
  children?: React.ReactNode;
}

const SlideTo = ({ to, title = "Voir ?", children }: SlideToProps) => {
  return (
    <div className="slide-to-wrapper flex gap-2">
      {title && <h3 className="prompt-text">{title}</h3>}
      <NavLink to={to}>
        {children || <button type='submit' className="slide-link">{to}</button>}
      </NavLink>
    </div>
  );
};

export default SlideTo;