import SiteHeader from "@/components/layouts/site-header"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

interface PagesLayoutProps {
    children: React.ReactNode
}

export default async function PagesLayout({ children }: PagesLayoutProps) {

    const user = await currentUser()

    const dbUser = await db.user.findUnique({
        where: {
            id: user?.id
        },
        select: {
            verified: true
        }
    })

    if (!dbUser) redirect('/account?origin=/')


    return (
        <>
            <SiteHeader />
            <main className="container max-w-[620px] px-6">
                {children}
            </main>
        </>
    )
}
