import { GetServerSideProps } from "next";
import Link from "next/link";
import { Title } from "@/styles/pages/Home";
import SEO from "@/components/SEO";
import { client } from "@/lib/prismic";
import Prismic from "prismic-javascript";
import PrismicDom from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {
  return (
    <div>
      <SEO
        title="DevCommerce, your best e-commerce!"
        image="boost.png"
        shouldExcludeTitleSuffix
      />
      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map((recommendedProduct) => {
            return (
              <li key={recommendedProduct.id}>
                <Link href={`/catalog/products/${recommendedProduct.uid}`}>
                  <a>
                    {PrismicDom.RichText.asText(recommendedProduct.data.title)}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

//para informações que precisam ser indexadas pelos motores de busca... a tela toda aparece de uma vez!
export const getServerSideProps: GetServerSideProps = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at("document.type", "product"),
  ]);

  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/recommended`
  // );
  // const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    },
  };
};
