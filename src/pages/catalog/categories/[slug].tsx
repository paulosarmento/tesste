import { GetStaticPaths, GetStaticProps } from 'next';
import {useRouter} from 'next/router';

interface Iproduct {
    id: string;
    title: string;
}

interface CategoryProps {
    products: Iproduct[]
}

export default function Category ({products}: CategoryProps){
    const router = useRouter();

    if (router.isFallback) {
        return <p>Carregando...</p>
    }

    return (
        <div>
            <h1>{router.query.slug}</h1>
            <ul>
                {products.map(products => {
                    return(
                    <li key={products.id}>
                        {products.title}
                    </li>
                    );
                })}
            </ul>
        </div>
    
    );
}

export const getStaticPaths: GetStaticPaths = async () => {

    const response = await fetch(`http://127.0.0.1:3333/categories`);
    const categories = await response.json();

    const paths = categories.map(category => {
        return {
            params:  { slug: category.id } 
        }
    })
    return {
        paths,
        fallback: true,    
    }

    
};

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {

    const { slug } = context.params;

    const response = await fetch(`http://127.0.0.1:3333/products?category_id=${slug}`);
    const products = await response.json();
    return {
        props: {
            products
        },
        revalidate: 60,
    }
}