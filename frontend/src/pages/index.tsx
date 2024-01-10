import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { GetServerSideProps } from "next";
import { ShapeUserData } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { getCookie, deleteCookie } from "cookies-next";

type Props = {
  user: string;
};

const MainDashboard: React.FC<Props> = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<ShapeUserData>();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUserData(JSON?.parse(user));
    }
  }, [user]);

  const handleLogout = useCallback(() => {
    deleteCookie("user");
    router.push("/login");
    toast.success("Log out successfully !");
  }, [router]);

  useEffect(() => {
    if (userData?.attributes[2]["custom:group"] === "client") {
      router.push("/client-dashboard");
    } else if (userData?.attributes[2]["custom:group"] === "content-manager") {
      router.push("/content-manager-dashboard");
    }
  }, [router, userData?.attributes]);

  return (
    <div className="flex w-full h-screen flex-col overflow-hidden">
      <div className="w-full bg-gray-800">
        <div className="flex justify-between items-center ">
          <div className="min-w-[310px] p-4">
            <Link
              href="/dashboard"
              className="text-white font-bold text-4xl p-4"
            >
              PublishPulse
            </Link>
          </div>

          <div className="text-white font-bold pr-4 flex items-center gap-4">
            <Image
              src={
                userData?.attributes[6]?.picture! ??
                "https://img.freepik.com/free-icon/user_318-159711.jpg?w=2000"
              }
              alt="User profile photo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <p>{userData?.attributes[3]?.given_name}</p>
            <div className="relative inline-block text-left">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                data-testid="right-menu"
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                ▼
              </button>
              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      data-testid="button-logout"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-screen w-full flex justify-center items-center text-white flex-col gap-4">
        <h1 className="text-6xl font-bold">Welcome !</h1>

        <p className="text-3xl">Redirecting....</p>
      </div>
    </div>
  );
};

export default MainDashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getCookie("user", { req: context.req, res: context.res });

  const userCookie = user;

  if (!userCookie) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
};
