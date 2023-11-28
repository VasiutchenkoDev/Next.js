import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { FC } from "react";
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || '';

import { musicWorkApi } from "@src/api/apis";
import { IMusicWork } from "@src/api/models";

import Content from "@src/components/organisms/Content";
import Header from "@src/components/organisms/Header";
import Layout from "@src/components/organisms/Layout";
import WorkDetails from "@src/components/templates/WorkDetails";

interface IWorkDetailsPageProps {
 musicWork: IMusicWork;
 prevUrl: string;
}

interface IWorkHeadProps {
 url: string;
 title: string;
 description: string;
}

const WorkDetailsPage: NextPage<IWorkDetailsPageProps> = ({
 musicWork,
 prevUrl,
}) => {
 const WorkHead: FC<IWorkHeadProps> = ({ url, title, description }) => {
  return (
   <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" key="title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
   </Head>
  );
 };
const titleHyphen = musicWork.attributes.title.trim().toLowerCase().replace(/\s+/g, '-').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
const composerHyphen = musicWork.attributes.composer.data?.attributes.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
 return (
  <Layout>
   <WorkHead
    url = {`${siteUrl}/work/${titleHyphen}-${composerHyphen}?id=${musicWork.id}`}
    title={`${musicWork.attributes.title}${
     musicWork.attributes.composer.data?.attributes.name &&
     ` by ${musicWork.attributes.composer.data?.attributes.name}`
    } - Piano Music Database`}
    description={`Explore ${musicWork.attributes.title} by ${musicWork.attributes.composer.data?.attributes.name} on Piano Music Database. Buy the sheet music, watch a performance, and learn about its elements, level, mood, and more.`}
   />
   <Header className="lg:fixed" />
   <Content>
    <WorkDetails musicWork={musicWork} prevUrl={prevUrl} />
   </Content>
  </Layout>
 );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
 try {
  const response = await musicWorkApi.get(
   (context?.query?.id as string) || "0",
   {
    populate: "deep",
   },
  );
  return {
   props: {
    musicWork: response.data.data,
    prevUrl: context.req.headers.referer ?? "",
   },
  };
 } catch (e) {
  return {
   redirect: {
    permanent: false,
    destination: "/404",
   },
  };
 }
};

export default WorkDetailsPage;
