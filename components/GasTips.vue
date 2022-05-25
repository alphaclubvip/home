<template>
  <div class="lg:grid lg:grid-cols-3 lg:gap-8">
    <div>
      <h2 class="text-3xl font-extrabold text-gray-900">Advanced Tips</h2>
      <p class="mt-4 text-lg text-gray-500">
        SPEED UP your transaction, but DO NOT WASTE.
      </p>
    </div>
    <div class="mt-12 lg:mt-0 lg:col-span-2">
      <dl class="space-y-12">
        <div>
          <dt class="text-lg leading-6 font-medium text-gray-900">
            Avoid the
            <span class="font-semibold">Out of gas</span> error
          </dt>
          <dd class="mt-2 text-base text-gray-500">
            <p>
              <span class="font-semibold">
                Safely increase the gas limit appropriately.
              </span>
              e.g. increase <span class="font-mono">263,231</span> to
              <span class="font-mono">300,000</span>
            </p>
            <p class="mt-1">
              Although MetaMask will automatically estimate the Gas Limit, in an
              actual transaction, this number will still be estimated a little
              lower, which will cause an
              <span class="font-semibold">out of gas</span> error, the
              transaction fee will still be spent, but the it will fail
              finnally. So manually turning it up would be a safer option. And
              this will not increase your actual cost, because the unused gas
              will be automatically refunded.
            </p>
          </dd>
        </div>
        <div>
          <dt class="text-lg leading-6 font-medium text-gray-900">
            Max Priority Fee
          </dt>
          <dd class="mt-2 text-base text-gray-500">
            <span class="font-mono">
              If (Max Priority Fee + Base Fee) &lt; Max Fee,
            </span>
            notice that all Max Priority Fee will be
            <span class="uppercase font-semibold">consumed.</span>
            So if you care about the transaction fee, you know what to do.
          </dd>
        </div>
        <div>
          <dt class="text-lg leading-6 font-medium text-gray-900">Max Fee</dt>
          <dd class="mt-2 text-base text-gray-500">
            Usually, Max Fee would not be fully cosumed,
            <span class="font-mono"> (Max Priority Fee + Base Fee) </span>
            will be the actual gas price.
          </dd>
        </div>

        <div>
          <dt class="text-lg leading-6 font-medium text-gray-900">
            About the slide
          </dt>
          <dd class="mt-2 text-base text-gray-500">
            <span class="font-semibold">20%</span> for default, which means if
            no particularly large number of transactions are sent by others,
            your transaction will be confirmed ahead of 20% of the transactions
            in the Next Block.
          </dd>
        </div>

        <div>
          <dt class="text-lg leading-6 font-medium text-gray-900">
            Annnnnd, you are an expert user?
          </dt>
          <dd class="mt-2 text-base text-gray-500">
            Feel free to use this data as a reference, you can of course make
            adjustments to your own expectations.
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
