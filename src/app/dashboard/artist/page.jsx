import GalleryTable from '@/components/artist-dashboard/GalleryTable';
import RecentSales from '@/components/artist-dashboard/RecentSales';
import StatsCard from '@/components/artist-dashboard/StatsCard';
import React from 'react';

const ArtistDashboardHomePage = () => {
    return (
        <>
      <StatsCard />
      <GalleryTable />
      <RecentSales />
    </>
    )
};

export default ArtistDashboardHomePage;