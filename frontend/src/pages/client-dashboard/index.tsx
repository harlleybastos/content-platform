import React, { useCallback, useEffect, useState } from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { useMainContext } from "@/context/MainContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { GetServerSideProps } from "next";
import { ShapeUserData } from "@/types";
import { deleteCookie, getCookie } from "cookies-next";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";

const AddArticleScreen = dynamic(
  () => import("@/components/client-dashboard/AddArticleScreen"),
  {
    ssr: false,
  }
);

const DashboardScreen = dynamic(
  () => import("@/components/client-dashboard/DashboardScreen"),
  {
    ssr: false,
  }
);

interface ShapeConditionalRender {
  [index: number]: JSX.Element;
}

type Props = {
  user: string;
};

const ClientDashboard: React.FC<Props> = ({ user }) => {
  const { currentIndex, setCurrentIndex } = useMainContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<ShapeUserData>();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUserData(JSON?.parse(user));
    }
  }, [user]);

  const renderConditionalScreen: ShapeConditionalRender = {
    0: <DashboardScreen />,
    1: <AddArticleScreen />,
  };

  const handleChangeScreen = useCallback(
    (index: number) => {
      setCurrentIndex(index);
    },
    [setCurrentIndex]
  );

  const handleLogout = useCallback(() => {
    deleteCookie("user");
    router.push("/login");
    toast.success("Log out successfully !");
  }, [router]);

  useEffect(() => {
    if (userData?.attributes[2]["custom:group"] === "content_creator") {
      toast.error(
        "You cannot access this page, redirecting to Content Creator Dashboard..."
      );
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
      <div className="flex h-full">
        <div className="h-full bg-gray-800 min-w-[5vw] md:min-w-[10vw] xl:min-w-[15vw] xl:flex flex-col justify-between pt-2">
          <div className="flex flex-col border-b-white">
            <ul>
              <li
                className={`pl-10 pt-4 pb-4 flex justify-start items-center hover:bg-green-600  hover:cursor-pointer transition-all ease-in-out ${
                  currentIndex === 0 && "bg-green-600 font-semibold"
                }`}
              >
                <button
                  type="button"
                  className="flex items-center text-white gap-4 text-2xl w-full"
                  onClick={() => handleChangeScreen(0)}
                  data-testid="dashboard-button"
                >
                  <BiSolidDashboard className="text-2xl" />
                  <span className="hidden xl:block">Dashboard</span>
                </button>
              </li>
              <li
                className={`my-10 mb-10 mx-4 p-4 border  rounded-md flex justify-center items-center hover:bg-green-600 hover:scale-110  hover:cursor-pointer transition-all ease-in-out ${
                  currentIndex === 1 && "bg-green-600 font-semibold"
                }`}
              >
                <button
                  type="button"
                  className="flex justify-center items-center text-white gap-4 text-2xl w-full"
                  onClick={() => handleChangeScreen(1)}
                  data-testid="new-article"
                >
                  <span className="hidden xl:block">New Article</span>
                  <AiOutlinePlus className="text-4xl text-green-500" />
                </button>
              </li>
            </ul>
          </div>
        </div>
        {renderConditionalScreen[currentIndex]}
      </div>
    </div>
  );
};

export default ClientDashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getCookie("user", { req: context.req, res: context.res });

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
};
