import './PageBackground.css';

interface PageBackgroundProps {
    opacity?: number;
}

export default function PageBackground({ opacity = 0.08 }: PageBackgroundProps) {
    return (
        <div
            className="page-background"
            style={{ opacity }}
            aria-hidden="true"
        />
    );
}
