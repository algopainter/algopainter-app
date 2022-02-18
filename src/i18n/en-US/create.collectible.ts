/* eslint-disable max-len */
export default {
  title: {
    main: 'Create Collectible',
    sub: 'Select "Import your file" or "Create with an AlgoPainter"',
  },
  create: {
    importFile: 'Import your file',
    createWithArtist: 'Create with an AlgoPainter',
    preview: 'Preview',
    example: 'Example',
    previewText: 'Upload file to preview your NFT Collectible',
    import: 'Choose File',
    descriFile: 'PNG, JPG or JPEG. Max 30MB.',
    errorFile: 'image must be less than 30MB',
    errorTypeImage: 'file type not allowed, allowed types are PNG, JPEG, JPG.',
    btnCreate: 'Create item',
    requiredField: 'Required field',
    collections: {
      batchPrice: 'BATCH PRICE ($ {coin})',
      remaining: 'REMAINING',
      minted: 'MINTED'
    },
    fields: {
      uploadLabel: 'Upload File',
      titleLabel: 'Title',
      descriptionLabel: 'Description',
      putOnSaleLabel: 'Put on sale',
      createRoyalty: 'Create Royalty %',
      createRoyaltyTooltip: 'This is the creator percentage royalty that the artist, who created the collection, will receive.',
      responsibility: 'By clicking on the checkbox, I agree that I am responsible for the submitted image and that it does not contain any pornographic attributes and does not violate any type of guideline, whether political, religious, or from any community, race, person, and country.',
      agreeValue: 'I understand and agree with the {CurrentAmount} {Token} amount that will be discounted to mint this artwork',
      agreeValueMultiple: 'I understand and agree with the {CurrentAmount} {Token} and {CurrentAmount2} {Token2} amount that will be discounted to mint this artwork',
    },
    exampleText: 'Sample art by the artist',
    batchPrince: 'BATCH PRICE',
    algoP: '($ALGOP)',
    remaining: 'REMAINING',
    minted: 'MINTED',
    goToArtist: ' Go to Artist',
    comingSoon: 'Coming Soon',
  },
  selectAi: {
    title: 'Select collection',
    titleHashly: 'Abstract Unique Art',
    textHashly1: 'Choose a unique and revolutionary style so that our artist can immortalize you in our gallery.',
    textHashly2: 'Our artist exclusively creates a totally unique work of art with the style you choose. Infinite possibilities to create, register and sell your works.',
    titleAngelo: 'Choose 2 Pictures',
    textAngelo1: 'Fractal art is a form of algorithmic art created by calculating fractal objects and representing the calculation results as still images, animations, and media. Fractal art was developed from the mid-1980s onwards.',
    titleClaude: 'Fractal Unique Art',
    textClaude1: 'Choose two images of your choice and create a new unique and limited work of art.',
    textClaude2: 'Our artist uniquely creates a work of art with the characteristics of the images sent. Endless possibilities to create, register and sell your works.',
  },
  mintModal: {
    title: 'Mint',
    description: 'Send transaction to create your NFT',
    btnCancel: 'Cancel',
    approveStatus:{
      approveIfpsTitle: 'Upload',
      approveIfpsAproved: 'Awaiting confirmation',
      approveIfpsError: 'The upload failed, try again',
      approveIfpsComplet: 'Upload complete! Thank you.',
      approveContractTitle: 'Approve Contract',
      approveContractApproved: 'Verifying if the contract is already approved.',
      approveContractInput: 'Awaiting confirmation.',
      approveContractError: 'Error in contract approval. Please try again.',
      approveContractConfirmation: 'Contract successfully approved!',
      approveContractAvailable: 'Smart contract approved',
      mintImageTitle: 'Mint',
      mintImageInput: 'Awaiting confirmation.',
      mintImageConfirmation: 'Awaiting confirmation.',
      mintImageError: 'Error minting the image. Please try again.',
      mintImageAvailable: 'YAY! Your artwork has been successfully minted.',
    }
  },
  collectionModal:{
    title: 'Create Collection',
    approveSignature: 'Upload',
    confirmeSignature: 'Upload complete! Thank you.',
    errorSignature: 'The upload failed, try again'
  },
  createCollection:{
    title: 'Create Collection',
    approveContractApproved: 'Verifying if the contract is already approved.',
    approveContractInput: 'Awaiting confirmation.',
    approveContractError: 'Error in contract approval. Please try again.',
    approveContractConfirmation: 'Contract successfully approved!',

  }
};
