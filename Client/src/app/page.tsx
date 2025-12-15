import NonDashboardNavbar from "@/components/NonDashboardNavbar"
import Landing from '@/app/(nondashboard)/landing/page'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-black">
      <NonDashboardNavbar />
      <main className="flex flex-grow w-full h-full justify-center items-center">
        <Landing />
      </main>
    </div>
  );
}
