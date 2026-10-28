'use client';

import { CollapsibleGroup } from '@nextadmin/components/tailgrids/core/collapsible';
import { cn } from '@nextadmin/utils/cn';
import { Logo } from '@nextadmin/utils/icon';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { LogOut } from 'lucide-react';
import Link from "@nextadmin/components/common/link";
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { Key } from 'react-aria-components';
import { NAV_DATA } from './data';
import { CloseIcon, SidebarExpandedIcon, ThreeDots } from './icon';
import NavItem from './nav-item';
import { findActiveGroupKey } from './utils';

export default function Sidebar({
    isSidebarOpen,
    toggleSidebar,
    isMobileSheet = false,
    onItemClick,
}: {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    isMobileSheet?: boolean;
    onItemClick?: () => void;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useAdminAuth();

    const handleSignOut = async () => {
        await signOut();
        router.replace('/admin-template/login');
    };

    // Compute which group should be open based on the current route
    const activeGroupKey = useMemo(
        () => findActiveGroupKey(pathname),
        [pathname],
    );

    const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(
        () => new Set<Key>(activeGroupKey ? [activeGroupKey] : []),
    );

    return (
        <div className='flex h-full min-h-0 flex-col overflow-hidden'>
            {/* Header */}
            <div
                className={cn(
                    'flex items-center px-4 pt-7 text-text-primary',
                    isSidebarOpen
                        ? 'justify-between'
                        : 'flex-col justify-center gap-4',
                )}
            >
                <Link href='/'>
                    <span className='flex items-center gap-3'>
                        <span className='flex size-10 items-center justify-center rounded-xl bg-background-gray-primary'>
                            <Logo />
                        </span>
                        {isSidebarOpen && (
                            <span className='flex flex-col text-left'>
                                <span className='text-sm font-semibold text-text-primary'>Pennywise</span>
                                <span className='text-xs text-text-tertiary'>Admin dashboard</span>
                            </span>
                        )}
                    </span>
                </Link>

                <button
                    onClick={() => toggleSidebar()}
                    className={cn(
                        'p-1.5 transition-colors',
                        isMobileSheet
                            ? 'rounded-lg text-icon-tertiary hover:bg-background-gray-primary hover:text-text-primary'
                            : 'text-icon-tertiary hover:text-text-secondary',
                    )}
                    aria-label={
                        isMobileSheet ? 'Close sidebar' : 'Toggle sidebar'
                    }
                >
                    {isMobileSheet ? <CloseIcon /> : <SidebarExpandedIcon />}
                </button>
            </div>

            {/* Navigation */}
            <nav
                data-lenis-prevent
                className={cn(
                    'admin-scroll-area min-h-0 flex-1 overflow-y-auto overscroll-contain',
                    isSidebarOpen ? 'mt-7 space-y-6 px-4' : 'mt-5 px-2',
                )}
            >
                <CollapsibleGroup
                    expandedKeys={expandedKeys}
                    onExpandedChange={setExpandedKeys}
                >
                    {NAV_DATA.map((section) => (
                        <div key={section.label}>
                            {/* Expanded: show section label | Collapsed: show divider between sections */}
                            {isSidebarOpen ? (
                                <p className='mt-6 mb-4 text-xs text-text-tertiary uppercase'>
                                    {section.label}
                                </p>
                            ) : (
                                section.label && (
                                    <span className='flex items-center justify-center pt-6 pb-4 text-icon-secondary'>
                                        <ThreeDots />
                                    </span>
                                )
                            )}

                            <div
                                className={cn(
                                    'space-y-1',
                                    !isSidebarOpen && 'space-y-1.5',
                                )}
                            >
                                {section.items.map((item) => (
                                    <NavItem
                                        key={item.title}
                                        id={item.title}
                                        icon={item.icon}
                                        label={item.title}
                                        href={item.url}
                                        items={item.items}
                                        hint={item.hint}
                                        collapsed={!isSidebarOpen}
                                        onItemClick={onItemClick}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </CollapsibleGroup>
            </nav>

            {/* Account controls */}
            {isSidebarOpen && (
                <div className='space-y-1 border-t border-card-border px-4 py-4'>
                    <button
                        type='button'
                        onClick={() => void handleSignOut()}
                        className='flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-background-gray-primary hover:text-text-primary'
                    >
                        <LogOut className='size-5 text-icon-tertiary' />
                        <span>Log out</span>
                    </button>
                </div>
            )}
        </div>
    );
}
