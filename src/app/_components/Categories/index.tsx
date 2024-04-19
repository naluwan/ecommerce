import React from 'react'
import Link from 'next/link'

import { Category } from '../../../payload/payload-types'
import CategoryCard from './CategoryCard'

import classes from './index.module.scss'

const Categories = ({ categories }: { categories: Category[] }) => {
  return (
    <section className={classes.container}>
      <div className={classes.titleWrapper}>
        <h3>所有品牌</h3>
        <Link href="/products">顯示全部</Link>
      </div>

      <div className={classes.list}>
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}

export default Categories
