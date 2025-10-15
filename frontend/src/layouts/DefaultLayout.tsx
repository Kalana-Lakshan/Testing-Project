import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function DefaultLayout() {
	const location = useLocation();

	const pathSegments = location.pathname.split("/").filter(Boolean);

	const breadcrumbs = [
		{ name: "Dashboard", path: "/" },
	].concat(
		location.pathname === "/dashboard" ? [] :																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																					
		pathSegments.map((segment, index) => ({
			name: segment.charAt(0).toUpperCase() + segment.slice(1),
			path: `/${pathSegments.slice(0, index + 1).join("/")}`,
		})));


	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="2xl:px-10">
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<Breadcrumb>
							<BreadcrumbList>
								{breadcrumbs.map((breadcrumb, index) => (
									<>
										<BreadcrumbItem key={index} className={index === 0 ? "hidden md:block" : ""}>
											<BreadcrumbLink href={breadcrumb.path}>
												{breadcrumb.name}
											</BreadcrumbLink>
										</BreadcrumbItem>
										{index < breadcrumbs.length - 1 && (
											<BreadcrumbSeparator className="hidden md:block" />
										)}
									</>
								))}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<main className="flex-1 p-4 md:p-6 2xl:py-8 2xl:px-15 flex justify-center">
					<div className="w-full max-w-10xl">
						<Outlet />
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}