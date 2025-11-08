'use client';
import { useEffect, useState } from 'react';

const screens = {
    sm: '640px',
    md: '768px',
    lg: '1513px',
    xl: '1280px'
};
const parse = (screen) => +screen?.slice(0, screen?.length - 2);

const SMALL_BREAKPOINT = parse(screens.sm);
const MEDIUM_BREAKPOINT = parse(screens.md);
const LARGE_BREAKPOINT = parse(screens.lg);
const XTRA_LARGE_BREAKPOINT = parse(screens.xl);

const CheckDevice = () => {
    const [deviceType, setDeviceType] = useState(null);

    const getWindowWidth = () => (typeof window !== 'undefined' ? window.document.documentElement.clientWidth : 0);

    const checkDevice = (width) => {
        if (width < SMALL_BREAKPOINT) return 'small-mobile';
        if (width < MEDIUM_BREAKPOINT) return 'mobile';
        if (width < LARGE_BREAKPOINT) return 'desktop';
        return 'large-desktop';
    };

    useEffect(() => {
        const handleResize = () => {
            const width = getWindowWidth();
            const type = checkDevice(width);
            setDeviceType(type);
        };

        handleResize(); // run once on mount

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (deviceType === null) return null; // or fallback like "loading..."

    return deviceType;
};

export default CheckDevice;
