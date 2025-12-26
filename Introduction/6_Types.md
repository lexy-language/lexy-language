# Complex types

A custom complex data type defines multiple fields with their type that can be used throughout calculations.
It defines a list of variables which are used together.

```
type TaxableIncome
  number NetSalary
  number OtherExpenses
  number InsurancePremiums
  number TaxableIncome
```

```
function TaxableIncomeFederalAndPerCanton
  // A tax calculation for Switzerland returns both federeal taxable income details, and details for the specified canton
  // Example taken from: https://swisstaxcalculator.estv.admin.ch/#/calculator/income-wealth-tax

  results
    TaxableIncome Canton
    TaxableIncome Federal
  
  Federal.NetSalary = 107603
  Federal.OtherExpenses = -3228
  Federal.InsurancePremiums = -1800
  Federal.TaxableIncome = Federal.NetSalary + Federal.OtherExpenses + Federal.InsurancePremiums

  Canton.NetSalary = 107603
  Canton.OtherExpenses = -3228
  Canton.InsurancePremiums = -2900
  Canton.TaxableIncome = Canton.NetSalary + Canton.OtherExpenses + Canton.InsurancePremiums
```

🖥️ Execute the function on the right to see the nested result values.

# Next

🖥 ️📄 [Next topic: Tables](https://github.com/lexy-language/lexy-language/blob/main/Introduction/7_Tables.md)
