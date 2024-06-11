import React from 'react';

type ContainerProps = {
    children: React.ReactNode;
}

export default function Container({ children}: ContainerProps) {
    return <div className="max-w-6xl mx-auto px-4">{children}</div>
}