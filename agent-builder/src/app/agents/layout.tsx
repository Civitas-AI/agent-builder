import DashboardNav from '@/components/DashboardNav';


export default function AgentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <DashboardNav />
            <main style={{ padding: '0 1rem'}}>
                {children}
            </main>
        </section>
    );
}