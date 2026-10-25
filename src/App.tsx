import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { RequestsView } from './views/RequestsView';
import { OrdersView } from './views/OrdersView';
import { DealersView } from './views/DealersView';
import { MyGarageView } from './views/MyGarageView';
import { SavedPartsView } from './views/SavedPartsView';
import { CategoriesView } from './views/CategoriesView';
import { MessagesView } from './views/MessagesView';
import { ProfileView } from './views/ProfileView';

// Dealer views
import { DealerDashboardView } from './views/dealer/DealerDashboardView';
import { DealerInventoryView } from './views/dealer/DealerInventoryView';
import { DealerRequestsView } from './views/dealer/DealerRequestsView';
import { DealerOrdersView } from './views/dealer/DealerOrdersView';

// Admin views
import { AdminDashboardView } from './views/admin/AdminDashboardView';

// Modals
import { PartDetailModal } from './components/PartDetailModal';
import { RequestPartWizard } from './components/RequestPartWizard';
import { QuotesComparisonModal } from './components/QuotesComparisonModal';
import { OrderDetailModal } from './components/OrderDetailModal';
import { InventoryItem, PartRequest, Order } from './types';

const MainContent: React.FC = () => {
  const { currentUser, orders, requests } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);

  // Modals state
  const [selectedPart, setSelectedPart] = useState<InventoryItem | null>(null);
  const [isRequestWizardOpen, setIsRequestWizardOpen] = useState(false);
  const [comparingRequest, setComparingRequest] = useState<PartRequest | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isDealerAddModalOpen, setIsDealerAddModalOpen] = useState(false);

  const handleSearchSubmit = () => {
    setCurrentTab('search');
  };

  const handleOrderSuccess = (orderId: string) => {
    setSelectedPart(null);
    const newOrd = orders.find((o) => o.id === orderId) || orders[0];
    if (newOrd) {
      setTrackingOrder(newOrd);
    }
    setCurrentTab('orders');
  };

  const handleOfferAccepted = (orderId: string) => {
    setComparingRequest(null);
    const newOrd = orders.find((o) => o.id === orderId) || orders[0];
    if (newOrd) {
      setTrackingOrder(newOrd);
    }
    setCurrentTab('orders');
  };

  const handleRequestSubmitted = (requestId: string) => {
    setIsRequestWizardOpen(false);
    setCurrentTab('requests');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Sticky Header with Town selector and persona switch */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={globalSearchQuery}
        onSearchChange={setGlobalSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Mechanic Views */}
        {currentUser.role === 'mechanic' && (
          <>
            {currentTab === 'home' && (
              <HomeView
                onSelectTab={setCurrentTab}
                onSelectPart={(part) => setSelectedPart(part)}
                onOpenRequestWizard={() => setIsRequestWizardOpen(true)}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setCurrentTab('search');
                }}
                onSelectDealer={(dealerId) => {
                  setSelectedDealerId(dealerId);
                  setCurrentTab('dealers');
                }}
              />
            )}

            {currentTab === 'search' && (
              <SearchView
                onSelectPart={(part) => setSelectedPart(part)}
                initialQuery={globalSearchQuery}
                initialCategory={selectedCategory}
                onClearCategory={() => setSelectedCategory('All')}
              />
            )}

            {currentTab === 'requests' && (
              <RequestsView
                onOpenWizard={() => setIsRequestWizardOpen(true)}
                onCompareQuotes={(req) => setComparingRequest(req)}
              />
            )}

            {currentTab === 'orders' && (
              <OrdersView
                onSelectOrder={(ord) => setTrackingOrder(ord)}
              />
            )}

            {currentTab === 'dealers' && (
              <DealersView
                onSelectPart={(part) => setSelectedPart(part)}
                onOpenRequestWizard={() => setIsRequestWizardOpen(true)}
                selectedDealerId={selectedDealerId}
                onClearSelectedDealer={() => setSelectedDealerId(null)}
              />
            )}

            {currentTab === 'garage' && <MyGarageView />}

            {currentTab === 'saved' && (
              <SavedPartsView
                onSelectPart={(part) => setSelectedPart(part)}
                onBrowseParts={() => setCurrentTab('search')}
              />
            )}

            {currentTab === 'categories' && (
              <CategoriesView
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setCurrentTab('search');
                }}
              />
            )}

            {currentTab === 'messages' && <MessagesView />}

            {currentTab === 'profile' && <ProfileView />}
          </>
        )}

        {/* Dealer Workspace Views */}
        {currentUser.role === 'dealer' && (
          <>
            {currentTab === 'dealer_dashboard' && (
              <DealerDashboardView
                onSelectTab={setCurrentTab}
                onOpenAddPart={() => setIsDealerAddModalOpen(true)}
              />
            )}

            {currentTab === 'dealer_inventory' && (
              <DealerInventoryView
                isAddModalOpen={isDealerAddModalOpen}
                onCloseAddModal={() => setIsDealerAddModalOpen(false)}
                onOpenAddModal={() => setIsDealerAddModalOpen(true)}
              />
            )}

            {currentTab === 'dealer_requests' && <DealerRequestsView />}

            {currentTab === 'dealer_quotations' && <DealerRequestsView />}

            {currentTab === 'dealer_orders' && <DealerOrdersView />}

            {currentTab === 'dealer_profile' && <ProfileView />}

            {currentTab === 'messages' && <MessagesView />}
          </>
        )}

        {/* Administrator Views */}
        {currentUser.role === 'admin' && (
          <>
            {(currentTab === 'admin_dashboard' ||
              currentTab === 'admin_dealers' ||
              currentTab === 'admin_users' ||
              currentTab === 'admin_listings' ||
              currentTab === 'admin_requests' ||
              currentTab === 'admin_orders' ||
              currentTab === 'admin_audit') && (
              <AdminDashboardView />
            )}
            {currentTab === 'messages' && <MessagesView />}
          </>
        )}
      </main>

      {/* Interactive Modals */}
      <PartDetailModal
        part={selectedPart}
        onClose={() => setSelectedPart(null)}
        onOrderSuccess={handleOrderSuccess}
      />

      {isRequestWizardOpen && (
        <RequestPartWizard
          onClose={() => setIsRequestWizardOpen(false)}
          onRequestSubmitted={handleRequestSubmitted}
        />
      )}

      <QuotesComparisonModal
        request={comparingRequest}
        onClose={() => setComparingRequest(null)}
        onOfferAccepted={handleOfferAccepted}
      />

      <OrderDetailModal
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
      />

      {/* Global Figma Footer */}
      <footer className="mt-auto border-t border-zinc-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p className="font-medium">
            Partna concept · The Gambia · Illustrative accounts and transactions · Terms & privacy
          </p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Serekunda · Banjul · Brikama</span>
            <span>·</span>
            <span>GMD Currency</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
